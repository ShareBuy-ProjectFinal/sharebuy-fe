import {
  Col,
  Divider,
  Flex,
  Form,
  Input,
  Row,
  Space,
  Typography,
  Upload,
  UploadFile,
} from 'antd';
import { AddIcon, RollBackIcon } from 'assets/svgs';
import ButtonCustom from 'components/Button/ButtonCustom';
import SelectForm from 'components/Input/SelectForm';
import SpaceCustom from 'components/Space/SpaceCustom';
import LableCustom from 'components/Text/LableCustom';
import TextCustom from 'components/Text/TextCustom';
import { useUser } from 'contexts/UserProvider';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PATH } from 'routes/Path';
import { toastError, toastSucess } from 'utils/toats';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'antd/es/form/Form';
import CategoryApis from 'apis/CategoryApis';
import { UploadApis } from 'apis/UploadApis';
import TableAddProductDetail from './TableAddProductDetail';
import ProductApis from 'apis/ProductApis';
import ButtonDownload from 'components/Button/ButtonDownload';
import { exportExcel_v2 } from 'utils/functionExport';

export interface IAttribute {
  optionAttribute: any[];
  attribute_id: any;
  optionAttributeValues: any[];
  attributeValue_ids: any;
}

const listAttributeDefault: IAttribute[] = [
  {
    optionAttribute: [],
    attribute_id: undefined,
    optionAttributeValues: [],
    attributeValue_ids: undefined,
  },
];

const ProductDetail = () => {
  const navigate = useNavigate();
  const childRef = useRef<any>();
  // const isSmallScreen = useMediaQuery('(max-width: 1024px)');
  const { user } = useUser();
  const [form] = useForm();
  const { id } = useParams<{ id: string }>();

  const [optionCategory, setOptionCategory] = useState<any>([]);
  const [optionCategoryValue, setOptionCategoryValue] = useState<any>([]);
  const [backgroundImage, setBackgroundImage] = useState<UploadFile[] | any>(
    [],
  );
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [dataProDetails, setDataProDetails] = useState<any>([]);
  const mutateCategory = useMutation({
    mutationFn: CategoryApis.getAll,
    onSuccess: (data: any) => {
      setOptionCategory(
        data.map((item: any) => ({ value: item._id, label: item.name })),
      );
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  const mutateCategoryValue = useMutation({
    mutationFn: CategoryApis.getById,
    onSuccess: (res: any) => {
      // console.log('res', res);
      if (res.level == 2) {
        form.setFieldsValue({
          category_id: res.parent._id,
          category_value_id: res._id,
        });
        mutateCategoryValue.mutate(res.parent._id);
      } else {
        setOptionCategoryValue(
          res?.children.map((item: any) => ({
            value: item._id,
            label: item.name,
          })) || [],
        );
      }
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  const mutateUploadImage = useMutation({
    mutationFn: async ({
      uploadFiles,
      isBackGround = false,
    }: {
      uploadFiles: UploadFile<any>[];
      isBackGround?: boolean;
    }) => {
      const promises = uploadFiles.map((file, index) => {
        if (file?.originFileObj) {
          const formData = new FormData();
          if (file?.originFileObj) {
            formData.append('file', file.originFileObj);
            return UploadApis.uploadImage(formData)
              .then((res: any) => {
                if (isBackGround) backgroundImage[0].url = res.url;
                else fileList[index].url = res.url;
                return res;
              })
              .catch((error) => {
                console.log('error', error);
              });
          }
        }
        return {};
      });
      return await Promise.all(promises);
    },
    onSuccess: (data: any, variable) => {
      // console.log('data', data);
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  const mutateUploadImageDetail = useMutation({
    mutationFn: async (base64s: any[]) => {
      const promises = base64s.map((item, index) => {
        if (item?.file) {
          const formData = new FormData();
          formData.append('file', item?.file.originFileObj);
          return UploadApis.uploadImage(formData)
            .then((res: any) => {
              // console.log('res', res);
              dataProDetails[index].image = res?.url;
              return res;
            })
            .catch((error) => {
              console.log('error', error);
            });
        }
        return {};
      });
      return await Promise.all(promises);
    },
    onSuccess: (res: any, variable) => {
      // console.log('res', res);
      // if (res?.data) dataProDetails[res.index].image = res.data.url;
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  //=======================================================================================================
  const mutateGetProductById = useMutation({
    mutationFn: ProductApis.getById,
    onSuccess: (data) => {
      // console.log('data', data);
      form.setFieldsValue({
        product_name: data.product_name,
        old_price: data.old_price,
        price: data.price,
        description: data.description,
      });
      mutateGetProductDetail.mutate(data._id);
      mutateCategoryValue.mutate(data.category_id);

      setBackgroundImage([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: data.image,
        },
      ]);
      setFileList(
        data.images.map((item: any, index: number) => ({
          uid: index,
          name: 'image.png',
          status: 'done',
          url: item,
        })),
      );
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  const mutateGetProductDetail = useMutation({
    mutationFn: ProductApis.getProductDetails,
    onSuccess: (data) => {
      // console.log('data', data);
      setDataProDetails(
        data.map((proDetail: any) => ({
          _id: proDetail._id,
          sub_id: proDetail.sub_id,
          price: proDetail.price,
          old_price: proDetail.old_price,
          quantity: proDetail.quantity,
          image: proDetail.image,
          listAttribute: proDetail.custom_attribute_values.map((item: any) => ({
            value: item._id,
            label: item.value,
          })),
        })),
      );
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  const mutateUpdateProduct = useMutation({
    mutationFn: ProductApis.updateProduct,
    onSuccess: (data) => {
      // console.log('data', data);
      toastSucess('Cập nhật sản phẩm thành công');
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  const mutateUpdateProductDetail = useMutation({
    mutationFn: ProductApis.updateProductDetail,
    onSuccess: (data) => {
      // console.log('data', data);
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  useEffect(() => {
    if (user) {
      mutateCategory.mutate();
      mutateGetProductById.mutate(id);
    }
  }, [user]);

  const handldFinish = async (values: any) => {
    if (backgroundImage.length == 0) {
      toastError('Vui lòng chọn ảnh nền');
      return;
    }
    if (fileList.length == 0) {
      toastError('Vui lòng chọn ảnh chi tiết');
      return;
    }

    console.log('backgroundImage', backgroundImage);
    console.log('fileList', fileList);
    console.log('dataProDetails', dataProDetails);

    const uploadImage = await Promise.all([
      mutateUploadImage.mutateAsync({
        uploadFiles: backgroundImage,
        isBackGround: true,
      }),
      mutateUploadImage.mutateAsync({ uploadFiles: fileList }),
      mutateUploadImageDetail.mutateAsync(dataProDetails),
    ]);

    console.log('backgroundImage', backgroundImage);
    console.log('fileList', fileList);
    console.log('dataProDetails', dataProDetails);

    const { category_id, category_value_id, quantity, ...params } =
      form.getFieldsValue();
    mutateUpdateProduct.mutate({
      ...params,
      _id: id,
      image: backgroundImage[0].url,
      images: fileList.map((item: any) => item.url),
      category_id: category_value_id,
    });

    dataProDetails.forEach((item: any) => {
      mutateUpdateProductDetail.mutate({
        _id: item._id,
        price: item.price,
        old_price: item.old_price,
        quantity: item.quantity,
        image: item?.image || null,
      });
    });
  };

  const handleChangeCategory = (value: any) => {
    if (value) {
      mutateCategoryValue.mutate(value);
      form.setFieldsValue({ category_value_id: undefined });
    } else {
      setOptionCategoryValue([]);
      form.setFieldsValue({ category_value_id: undefined });
    }
  };

  const onChangeImageDetail = (info: any) => {
    info.file.status = 'done';
    const newFileList = [...info.fileList];

    // if (newFileList.length > 5) {
    //   toastError('Chỉ được phép chọn 5 ảnh.');
    //   newFileList = newFileList.slice(0, 5);
    // }

    setFileList(newFileList);
  };

  const onChangeImageBackground = (info: any) => {
    const newFileList = [
      { ...info.fileList[info.fileList.length - 1], status: 'done' },
    ];
    if (newFileList.length > 1) {
      newFileList.shift();
    }
    setBackgroundImage(newFileList);
  };

  const handleDownload = () => {
    if (childRef && childRef.current) childRef.current.handleDownload();
  };

  return (
    <Space className="pt-7 pb-7 px-8 w-full" direction="vertical">
      <Flex vertical>
        <Space
          className="text-[#7E84A3] cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <RollBackIcon />
          Quay lại
        </Space>

        <Flex justify="space-between" align="center">
          <Typography.Text className="text-3xl font-bold">
            Thêm sản phẩm
          </Typography.Text>
          <Space>
            <ButtonDownload onClick={handleDownload} />
          </Space>
        </Flex>
      </Flex>

      <Form
        form={form}
        layout="vertical"
        className="mt-2"
        onFinish={handldFinish}
      >
        <Flex className="w-full" gap={25}>
          {/* right */}
          {/* <div className=""> */}
          <SpaceCustom
            className="px-8 min-w-[300px] "
            width="60%"
            direction="vertical"
          >
            <Space direction="vertical" className="w-full " size={0}>
              <LableCustom value={'Thông tin sản phẩm'} />
              <Form.Item
                label="Sản phẩm"
                className="mt-1 mb-3"
                name={'product_name'}
              >
                <Input placeholder="Nhập tên sản phẩm" />
              </Form.Item>
              <Row justify={'space-between'} className=" mb-2" gutter={[15, 5]}>
                <Col className="sm:w-full lg:w-1/2 sm:min-w-[256px] lg:min-w-[100px]">
                  <Form.Item
                    label="Giá sản phẩm"
                    name={'old_price'}
                    className="w-full mb-1"
                  >
                    <Input placeholder="Nhập giá" />
                  </Form.Item>
                </Col>
                <Col className="sm:w-full lg:w-1/2 sm:min-w-[256px] lg:min-w-[100px]">
                  <Form.Item
                    label="Giá giảm"
                    name={'price'}
                    className="w-full mb-1"
                  >
                    <Input placeholder={`Nhập giá giảm`} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                label="Mô tả sản phẩm"
                name={'description'}
                className="my-0"
              >
                <Input.TextArea placeholder="Nhập tên sản phẩm" rows={4} />
              </Form.Item>
            </Space>

            {/* Table các sản phẩm chi tiết*/}
            <LableCustom value={'Chi tiết sản phẩm'} className="!mb-0" />
            <Divider className="mt-0 mb-0 border" />
            <TableAddProductDetail data={dataProDetails} ref={childRef} />
          </SpaceCustom>
          {/* </div> */}

          {/* left */}
          <Flex
            vertical
            className="w-[40%]"
            justify="space-between"
            align="flex-end"
            gap={20}
          >
            {/* top left */}
            <Space direction="vertical" className="w-full" size={20}>
              <SpaceCustom direction="vertical" size={5}>
                <LableCustom value={'Phân loại'} />
                <Form.Item
                  name={'category_id'}
                  label="Phân loại"
                  className="mb-1"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn một giá trị',
                    },
                  ]}
                >
                  <SelectForm
                    size="middle"
                    placeholder="Chọn phân loại"
                    options={optionCategory}
                    onChange={handleChangeCategory}
                    // dropdownRender={(menu) => (
                    //   <>
                    //     {menu}
                    //     <div
                    //       className="px-3 py-[5px] text-primary-60 font-bold cursor-pointer hover:opacity-50"
                    //       // onClick={() => setIsOpenTripModal(true)}
                    //     >
                    //       Tạo mới
                    //     </div>
                    //   </>
                    // )}
                  />
                </Form.Item>
                <Form.Item
                  name={'category_value_id'}
                  label="Phân loại con"
                  className="mb-1"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn một giá trị',
                    },
                  ]}
                >
                  <SelectForm
                    size="middle"
                    placeholder="Chọn phân loại con"
                    options={optionCategoryValue}
                    // dropdownRender={(menu) => (
                    //   <>
                    //     {menu}
                    //     <div
                    //       className="px-3 py-[5px] text-primary-60 font-bold cursor-pointer hover:opacity-50"
                    //       // onClick={() => setIsOpenTripModal(true)}
                    //     >
                    //       Tạo mới
                    //     </div>
                    //   </>
                    // )}
                  />
                </Form.Item>
              </SpaceCustom>

              {/* Hình ảnh nền*/}
              <SpaceCustom direction="vertical">
                <Space direction="vertical" className="w-full" size={0}>
                  <LableCustom value={'Hình ảnh nền'} />
                  <Form.Item
                    // className="mt-3 my-0"
                    className={`mt-3 my-0 ${backgroundImage.length > 0 ? 'hidden' : ''}`}
                  >
                    <Upload.Dragger
                      listType="picture-card"
                      accept=".png,.jpg,.jpeg"
                      fileList={backgroundImage}
                      onChange={onChangeImageBackground}
                      beforeUpload={(file) => {
                        const isImage =
                          file.type === 'image/png' ||
                          file.type === 'image/jpeg' ||
                          file.type === 'image/jpg';
                        if (!isImage) {
                          toastError(
                            'Chỉ được phép chọn file hình ảnh với định dạng PNG, JPG, hoặc JPEG',
                          );
                        }
                        return isImage || Upload.LIST_IGNORE;
                      }}
                      showUploadList={{
                        showPreviewIcon: false,
                        showRemoveIcon: true,
                        showDownloadIcon: false,
                      }}
                    >
                      <Space direction="vertical" className="m-0">
                        <ButtonCustom htmlType="button" size="small">
                          Thêm ảnh
                        </ButtonCustom>
                        <TextCustom value="Kéo thả hoặc chọn ảnh từ máy tính" />
                      </Space>
                    </Upload.Dragger>
                  </Form.Item>
                  <Col
                    style={{ paddingLeft: 0, paddingRight: 0 }}
                    className={`mt-2 ${backgroundImage.length == 0 ? 'hidden' : ''}`}
                    span={24}
                  >
                    <Upload
                      accept=".png,.jpg,.jpeg"
                      listType="picture-card"
                      fileList={backgroundImage}
                      onChange={onChangeImageBackground}
                      beforeUpload={(file) => {
                        const isImage =
                          file.type === 'image/png' ||
                          file.type === 'image/jpeg' ||
                          file.type === 'image/jpg';
                        if (!isImage) {
                          toastError(
                            'Chỉ được phép chọn file hình ảnh với định dạng PNG, JPG, hoặc JPEG',
                          );
                        }
                        return isImage || Upload.LIST_IGNORE;
                      }}
                      // multiple={true}
                      showUploadList={{
                        showPreviewIcon: false,
                        showRemoveIcon: true,
                        showDownloadIcon: false,
                      }}
                    >
                      <AddIcon className="w-9 h-auto text-primary-40 " />
                    </Upload>
                  </Col>
                </Space>
              </SpaceCustom>

              {/* Hình ảnh chi tiết */}
              <SpaceCustom direction="vertical">
                <Space direction="vertical" className="w-full" size={0}>
                  <LableCustom value={'Hình ảnh chi tiết'} />
                  <Form.Item
                    // className="mt-3 my-0"
                    className={`mt-3 my-0 ${fileList.length > 0 ? 'hidden' : ''}`}
                  >
                    <Upload.Dragger
                      listType="picture-card"
                      multiple
                      accept=".png,.jpg,.jpeg"
                      fileList={fileList}
                      onChange={onChangeImageDetail}
                      beforeUpload={(file) => {
                        const isImage =
                          file.type === 'image/png' ||
                          file.type === 'image/jpeg' ||
                          file.type === 'image/jpg';
                        if (!isImage) {
                          toastError(
                            'Chỉ được phép chọn file hình ảnh với định dạng PNG, JPG, hoặc JPEG',
                          );
                        }
                        return isImage || Upload.LIST_IGNORE;
                      }}
                      showUploadList={{
                        showPreviewIcon: false,
                        showRemoveIcon: true,
                        showDownloadIcon: false,
                      }}
                    >
                      <Space direction="vertical" className="m-0">
                        <ButtonCustom htmlType="button" size="small">
                          Thêm ảnh
                        </ButtonCustom>
                        <TextCustom value="Kéo thả hoặc chọn ảnh từ máy tính" />
                      </Space>
                    </Upload.Dragger>
                  </Form.Item>
                  <Col
                    style={{ paddingLeft: 0, paddingRight: 0 }}
                    className={`mt-2 ${fileList.length == 0 ? 'hidden' : ''}`}
                    span={24}
                  >
                    <Upload
                      accept=".png,.jpg,.jpeg"
                      listType="picture-card"
                      fileList={fileList}
                      onChange={onChangeImageDetail}
                      beforeUpload={(file) => {
                        const isImage =
                          file.type === 'image/png' ||
                          file.type === 'image/jpeg' ||
                          file.type === 'image/jpg';
                        if (!isImage) {
                          toastError(
                            'Chỉ được phép chọn file hình ảnh với định dạng PNG, JPG, hoặc JPEG',
                          );
                        }
                        return isImage || Upload.LIST_IGNORE;
                      }}
                      multiple={true}
                      showUploadList={{
                        showPreviewIcon: false,
                        showRemoveIcon: true,
                        showDownloadIcon: false,
                      }}
                    >
                      <AddIcon className="w-9 h-auto text-primary-40 " />
                    </Upload>
                  </Col>
                </Space>
              </SpaceCustom>
            </Space>

            {/* bottom left */}
            <Row className="mr-4 mb-3" gutter={[10, 10]}>
              <Col>
                <ButtonCustom
                  htmlType="button"
                  size="px-9 py-2"
                  value="Huỷ"
                  onClick={() => toastSucess('Huỷ thành công')}
                />
              </Col>
              <Col>
                <ButtonCustom size="px-9 py-2" value="Chỉnh sửa" fill />
              </Col>
            </Row>
          </Flex>
        </Flex>
      </Form>
    </Space>
  );
};

export default memo(ProductDetail);
