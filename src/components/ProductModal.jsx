import { useEffect, useMemo, useState } from "react";

import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductModal({ getProducts, modalType, templateProduct, closeModal }) {
  const [tempData, setTempData] = useState(templateProduct);
    // 使用 useMemo 計算新資料，避免每次渲染都創建新物件
  const computedData = useMemo(() => {
    const src = templateProduct || {};
    return {
      id: src.id ?? "",
      title: src.title ?? "",
      category: src.category ?? "",
      origin_price: src.origin_price ?? "",
      price: src.price ?? "",
      unit: src.unit ?? "",
      description: src.description ?? "",
      content: src.content ?? "",
      is_enabled: !!src.is_enabled,
      imageUrl: src.imageUrl ?? "",
      imagesUrl:
        Array.isArray(src.imagesUrl) && src.imagesUrl.length
          ? [...src.imagesUrl]
          : [""],
      shipping: Array.isArray(src.shipping) ? [...src.shipping] : [],
    };
  }, [templateProduct]);
  // 只在 computedData 改變時更新
  useEffect(() => {
    setTempData(computedData);
  }, [computedData]);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(imageUrl);
    showAlert("success", "複製成功");
  };
  const handleModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setTempData((preData) => ({
      ...preData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleModalImageChange = (index, value) => {
    setTempData((pre) => {
      const newImages = [...pre.imagesUrl];
      newImages[index] = value;

      if (
        value !== "" &&
        index === newImages.length - 1 &&
        newImages.length < 5
      ) {
        newImages.push("");
      }
      if (
        value === "" &&
        newImages.length > 1 &&
        newImages[newImages.length - 1] === ""
      ) {
        newImages.pop();
      }

      return {
        ...pre,
        imagesUrl: newImages,
      };
    });
  };

  const handleAddImage = () => {
    setTempData((pre) => {
      const newImages = [...pre.imagesUrl];
      newImages.push("");
      return {
        ...pre,
        imagesUrl: newImages,
      };
    });
  };

  const handleRemoveImage = (index) => {
    setTempData((pre) => {
      const newImages = pre.imagesUrl.filter((_, i) => i !== index);
      return {
        ...pre,
        imagesUrl: newImages,
      };
    });
  };

  const [alertState, setAlertState] = useState({
    show: false,
    type: "success", // success | danger
    message: "",
  });
  const showAlert = (type, message) => {
    setAlertState({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setAlertState({
        show: false,
        type: "success",
        message: "",
      });
    }, 1500);
  };

  const updateProduct = async (id) => {
    let url = `${API_BASE}/api/${API_PATH}/admin/product`;
    let method = "post";
    if (modalType === "edit") {
      url = `${API_BASE}/api/${API_PATH}/admin/product/${id}`;
      method = "put";
    }

    const productData = {
      data: {
        ...tempData,
        origin_price: Number(tempData.origin_price),
        price: Number(tempData.price),
        is_enabled: tempData.is_enabled ? 1 : 0,
        imagesUrl: [...tempData.imagesUrl.filter((url) => url !== "")],
        shipping: Array.isArray(tempData.shipping)
          ? [...tempData.shipping]
          : [],
      },
    };

    if (!Array.isArray(tempData.shipping) || tempData.shipping.length === 0) {
      showAlert("danger", "請至少選擇一項配送方式");
      return;
    }

    try {
      const res = await axios[method](url, productData);
      showAlert("success", res.data.message);
      getProducts();
      closeModal();
    } catch (error) {
      showAlert("danger", error.response?.data?.message || error.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${id}`,
      );
      showAlert("success", res.data.message);
      getProducts();
      closeModal();
    } catch (error) {
      showAlert("danger", error.response?.data?.message || error.message);
    }
  };

  const [imageUrl, setImageUrl] = useState("");

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file-to-upload", file);
      const res = await axios.post(
        `${API_BASE}/api/${API_PATH}/admin/upload`,
        formData,
      );
      setImageUrl(res.data.imageUrl);
    } catch (error) {
      console.error(error);
    }
  };

  const SHIPPING_OPTIONS = [
    { key: "home_delivery", label: "宅配" },
    { key: "convenience_store", label: "超商" },
    { key: "self_pickup", label: "自取" },
  ];

  const handleShippingChange = (e) => {
    const { value, checked } = e.target;
    setTempData((prev) => {
      const prevArr = Array.isArray(prev.shipping) ? [...prev.shipping] : [];
      if (checked) {
        if (!prevArr.includes(value)) prevArr.push(value);
      } else {
        const idx = prevArr.indexOf(value);
        if (idx > -1) prevArr.splice(idx, 1);
      }
      return { ...prev, shipping: prevArr };
    });
  };
  return (
    <>
      {alertState.show && (
        <div
          className={`alert alert-${alertState.type} position-fixed`}
          style={{
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2000,
            minWidth: "300px",
          }}
          role="alert"
        >
          {alertState.message}
        </div>
      )}

      <div
        id="productModal"
        className="modal fade"
        tabIndex="-1"
        aria-labelledby="productModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content border-0">
            <div
              className={`modal-header bg-${
                modalType === "delete" ? "danger" : "dark"
              } text-white`}
            >
              <h5 id="productModalLabel" className="modal-title">
                <span>
                  {modalType === "delete"
                    ? "刪除"
                    : modalType === "edit"
                      ? "編輯"
                      : "新增"}
                  產品
                </span>
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {modalType === "delete" ? (
                <p className="fs-4">
                  確定要刪除
                  <span className="text-danger">{tempData.title}</span>
                  嗎？
                </p>
              ) : (
                <div className="row">
                  <div className="col-sm-4">
                    <div className="mb-2">
                      <div className="mb-3">
                        <label htmlFor="fileUpload" className="form-label">
                          請上傳圖片
                        </label>
                        <input
                          className="form-control"
                          type="file"
                          name="fileUpload"
                          id="fileUpload"
                          accept=".jpg, .jpeg, .png"
                          onChange={uploadImage}
                        />
                      </div>
                      <p>
                        {imageUrl}
                        <button
                          type="button"
                          className="btn"
                          onClick={() => handleCopy()}
                        >
                          {imageUrl ? <i className="bi bi-copy"></i> : <></>}
                        </button>
                      </p>
                      <div className="mb-3">
                        <label htmlFor="imageUrl" className="form-label">
                          輸入圖片網址
                        </label>
                        <input
                          type="text"
                          id="imageUrl"
                          name="imageUrl"
                          className="form-control"
                          placeholder="請輸入圖片連結"
                          value={tempData.imageUrl}
                          onChange={(e) => handleModalInputChange(e)}
                        />
                      </div>
                      {tempData.imageUrl && (
                        <img
                          className="img-fluid"
                          src={tempData.imageUrl}
                          alt={tempData.title}
                        />
                      )}
                    </div>
                    <div>
                      {tempData.imagesUrl.map((url, index) => (
                        <div key={index}>
                          <label htmlFor="imageUrl" className="form-label">
                            輸入圖片網址
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={`圖片網址${index + 1}`}
                            value={url}
                            onChange={(e) =>
                              handleModalImageChange(index, e.target.value)
                            }
                          />
                          {url && (
                            <img
                              className="img-fluid"
                              src={url}
                              alt={`副圖${index + 1}`}
                            />
                          )}
                          <div>
                            <button
                              className="btn btn-outline-danger btn-sm d-block w-100"
                              onClick={() => {
                                handleRemoveImage(index);
                              }}
                            >
                              刪除圖片
                            </button>
                          </div>
                        </div>
                      ))}
                      {tempData.imagesUrl.length < 5 &&
                        tempData.imagesUrl[tempData.imagesUrl.length - 1] !==
                          "" && (
                          <button
                            className="btn btn-outline-primary btn-sm d-block w-100"
                            onClick={() => {
                              handleAddImage();
                            }}
                          >
                            新增圖片
                          </button>
                        )}
                    </div>
                  </div>
                  <div className="col-sm-8">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">
                        標題
                      </label>
                      <input
                        name="title"
                        id="title"
                        type="text"
                        className="form-control"
                        placeholder="請輸入標題"
                        value={tempData.title}
                        onChange={(e) => handleModalInputChange(e)}
                      />
                    </div>

                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="category" className="form-label">
                          分類
                        </label>
                        <input
                          name="category"
                          id="category"
                          type="text"
                          className="form-control"
                          placeholder="請輸入分類"
                          value={tempData.category}
                          onChange={(e) => handleModalInputChange(e)}
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="unit" className="form-label">
                          單位
                        </label>
                        <input
                          name="unit"
                          id="unit"
                          type="text"
                          className="form-control"
                          placeholder="請輸入單位"
                          value={tempData.unit}
                          onChange={(e) => handleModalInputChange(e)}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="origin_price" className="form-label">
                          原價
                        </label>
                        <input
                          name="origin_price"
                          id="origin_price"
                          type="number"
                          min="0"
                          className="form-control"
                          placeholder="請輸入原價"
                          value={tempData.origin_price}
                          onChange={(e) => handleModalInputChange(e)}
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="price" className="form-label">
                          售價
                        </label>
                        <input
                          name="price"
                          id="price"
                          type="number"
                          min="0"
                          className="form-control"
                          placeholder="請輸入售價"
                          value={tempData.price}
                          onChange={(e) => handleModalInputChange(e)}
                        />
                      </div>
                    </div>
                    <hr />

                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        產品描述
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        className="form-control"
                        placeholder="請輸入產品描述"
                        value={tempData.description}
                        onChange={(e) => handleModalInputChange(e)}
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="content" className="form-label">
                        說明內容
                      </label>
                      <textarea
                        name="content"
                        id="content"
                        className="form-control"
                        placeholder="請輸入說明內容"
                        value={tempData.content}
                        onChange={(e) => handleModalInputChange(e)}
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">配送方式</label>
                      <div>
                        {SHIPPING_OPTIONS.map((opt) => (
                          <div
                            className="form-check form-check-inline"
                            key={opt.key}
                          >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`shipping-${opt.key}`}
                              value={opt.key}
                              checked={
                                Array.isArray(tempData.shipping) &&
                                tempData.shipping.includes(opt.key)
                              }
                              onChange={handleShippingChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`shipping-${opt.key}`}
                            >
                              {opt.label}
                            </label>
                          </div>
                        ))}
                        {(!Array.isArray(tempData.shipping) ||
                          tempData.shipping.length === 0) && (
                          <div className="text-danger small">
                            請至少選擇一項配送方式
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          name="is_enabled"
                          id="is_enabled"
                          className="form-check-input"
                          type="checkbox"
                          checked={tempData.is_enabled}
                          onChange={(e) => handleModalInputChange(e)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="is_enabled"
                        >
                          是否啟用
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              {modalType === "delete" ? (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => deleteProduct(tempData.id)}
                >
                  刪除
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    data-bs-dismiss="modal"
                    onClick={() => closeModal()}
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => updateProduct(tempData.id)}
                    disabled={
                      !Array.isArray(tempData.shipping) ||
                      tempData.shipping.length === 0
                    }
                  >
                    確認
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductModal;
