import {
  Col,
  Divider,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
  Upload,
  UploadFile,
} from 'antd';
import { AddIcon, RollBackIcon } from 'assets/svgs';
import ButtonAction from 'components/Button/ButtonAction';
import ButtonCustom from 'components/Button/ButtonCustom';
import ButtonDownload from 'components/Button/ButtonDownload';
import SelectForm from 'components/Input/SelectForm';
import SpaceCustom from 'components/Space/SpaceCustom';
import LableCustom from 'components/Text/LableCustom';
import TextCustom from 'components/Text/TextCustom';
import { useUser } from 'contexts/UserProvider';
import React, { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from 'routes/Path';
import { toastError, toastSucess } from 'utils/toats';
import ModalAddAttribute from './Modal/ModalAddAttribute';
import { useMediaQuery } from '@uidotdev/usehooks';
import { useMutation } from '@tanstack/react-query';
import { AttributeApis } from 'apis/AttributeApis';
import { useForm } from 'antd/es/form/Form';
import SelectAddForm from 'components/Input/SelectAddForm';
import CategoryApis from 'apis/CategoryApis';
import { checkFormValidate, combine } from 'utils/function';
import { UploadApis } from 'apis/UploadApis';
import TableAddProductDetail from './TableAddProductDetail';
import { dataCategoryMen } from 'mocks/Category/data';
import ProductApis from 'apis/ProductApis';

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

const AddProductPage = () => {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width: 1024px)');
  const { user } = useUser();
  const [form] = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [isAddAttribute, setIsAddAttribute] = useState(true);
  const [optionCategory, setOptionCategory] = useState<any>([]);
  const [optionCategoryValue, setOptionCategoryValue] = useState<any>([]);
  const [optionAttribute, setOptionAttribute] = useState<any>([]);
  const [listAttribute, setListAttribute] =
    useState<IAttribute[]>(listAttributeDefault);
  const [attributeSelected, setAttributeSelected] = useState<IAttribute>();
  const [backgroundImage, setBackgroundImage] = useState<UploadFile[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [dataProDetails, setDataProDetails] = useState<any>([]);

  const mutateAttribute = useMutation({
    mutationFn: AttributeApis.GetAllByShopId,
    onSuccess: (data: any) => {
      const newOptionAttribute = data.map((item: any) => ({
        value: item._id,
        label: item.attribute_name,
      }));
      setOptionAttribute(newOptionAttribute);
      setListAttribute([
        {
          optionAttribute: newOptionAttribute,
          attribute_id: undefined,
          optionAttributeValues: [],
          attributeValue_ids: undefined,
        },
      ]);
    },
    onError: (error) => {
      console.log('error attribute', error);
    },
  });

  const mutateAttributeValue = useMutation({
    mutationFn: AttributeApis.getAllByCustomAttributeID,
    onSuccess: (data: any, variable) => {
      // console.log('data', data, variable.index);
      const optionsValue = data.map((item: any) => ({
        // value: { _id: item._id, name: item.value },
        value: item._id,
        label: item.value,
      }));

      setListAttribute((pre) => {
        return mapAttribute(
          pre,
          variable.attributeId,
          variable.index,
          optionsValue,
        );
      });
    },
    onError: (error) => {
      console.log('error attributeValue', error);
    },
  });

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
    onSuccess: (data: any) => {
      setOptionCategoryValue(
        data?.children.map((item: any) => ({
          value: item._id,
          label: item.name,
        })) || [],
      );
      form.setFieldsValue({ category_value_id: undefined });
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
      const promises = uploadFiles.map((file) => {
        const formData = new FormData();
        if (file.originFileObj) formData.append('file', file.originFileObj);
        return UploadApis.uploadImage(formData);
      });
      return await Promise.all(promises);
    },
    onSuccess: (data: any, variable) => {
      if (variable.isBackGround && data?.[0])
        backgroundImage[0].url = data[0].url;
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
          return UploadApis.uploadImage(formData).then((res: any) => {
            // console.log('res', res);
            dataProDetails[index].imageUrl = res?.url;
            return res;
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

  const mutateAddProductDetail = useMutation({
    mutationFn: ProductApis.createProductDetail,
    onSuccess: (data: any) => {
      console.log('data', data);
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  const mutateAddProduct = useMutation({
    mutationFn: ProductApis.createProduct,
    onSuccess: (data: any) => {
      // console.log('data', data);
      dataProDetails.forEach((item: any) => {
        mutateAddProductDetail.mutate({
          product_id: data._id as string,
          name: data.product_name, // Provide appropriate value
          old_price: item.old_price, // Provide appropriate value
          price: item.price, // Provide appropriate value
          quantity: item.quantity, // Provide appropriate value
          image: item?.imageUrl, // Provide appropriate value
          custom_attribute_values:
            item.listAttribute.map((item: any) => item.value) || [],
        });
      });
      toastSucess('Thêm sản phẩm thành công');
      navigate(PATH.productDetailById(data._id), { replace: true });
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  useEffect(() => {
    if (user) {
      // console.log('first');
      mutateAttribute.mutate(user._id);
      mutateCategory.mutate();
    }
  }, [user]);

  const mapAttribute = (
    pre: IAttribute[],
    attribute_id: any,
    indexFilter: number,
    optionsValue: any,
  ): IAttribute[] => {
    const preAttribute_ids = pre.map((item, index) =>
      index == indexFilter ? attribute_id : item?.attribute_id,
    );

    if (pre.length == indexFilter) {
      pre[indexFilter] = {
        attribute_id: attribute_id,
        optionAttribute: [],
        attributeValue_ids: optionsValue[0]?.value,
        optionAttributeValues: [],
      };
    }
    return pre.map((item, index) => {
      if (index == indexFilter) {
        item.attribute_id = attribute_id;
        // item.attributeValue_ids = [];
        item.optionAttributeValues = optionsValue;
      }
      item.optionAttribute = optionAttribute.filter(
        (option: any) =>
          item.attribute_id == option.value ||
          !preAttribute_ids.includes(option.value),
      );

      return item;
    });
  };

  const handldFinish = async (values: any) => {
    if (backgroundImage.length == 0) {
      toastError('Vui lòng chọn ảnh nền');
      return;
    }
    if (fileList.length == 0) {
      toastError('Vui lòng chọn ảnh chi tiết');
      return;
    }
    // // console.log('uploadImage', uploadImage); //uplaoImage[0] là ảnh nền, uploadImage[1] là ảnh chi tiết
    if (!isValidateAttribute()) {
      const uploadImage = await Promise.all([
        mutateUploadImage.mutateAsync({
          uploadFiles: backgroundImage,
          isBackGround: true,
        }),
        mutateUploadImage.mutateAsync({ uploadFiles: fileList }),
        mutateUploadImageDetail.mutateAsync(dataProDetails),
      ]);
      console.log('uploadImage', uploadImage);
      const { category_id, category_value_id, quantity, ...params } =
        form.getFieldsValue();
      mutateAddProduct.mutate({
        ...params,
        image: uploadImage[0]?.[0]?.url,
        images: uploadImage[1].map((item: any) => item.url),
        category_id: category_value_id,
        shop_id: user?._id,
        custom_attributes: listAttribute
          .filter((item) => item.attribute_id)
          .map((item) => item.attribute_id),
      });
    }
    // console.log('data', listAttribute);
    // console.log('da', dataProDetails);
  };

  const onChangeAttribute = (value: any, index: number) => {
    listAttribute[index].attributeValue_ids = [];
    setDataProDetails(
      combine(
        listAttribute
          .filter(
            (item) =>
              item.attributeValue_ids && item.attributeValue_ids?.length > 0,
          )
          .map((item) => item.attributeValue_ids),
      ).map((item) => ({
        listAttribute: item,
      })),
    );
    if (value) {
      mutateAttributeValue.mutate({ attributeId: value, index });
    } else {
      setListAttribute((pre) => mapAttribute(pre, undefined, index, undefined));
    }
  };

  const onChangeAttributeValue = (value: any, index: number) => {
    listAttribute[index].attributeValue_ids = value;
    setDataProDetails(
      combine(listAttribute.map((item) => item.attributeValue_ids)).map(
        (item) => ({
          listAttribute: item,
        }),
      ),
    );
    setListAttribute((pre) => {
      const newList = [...pre];
      newList[index].attributeValue_ids = value;

      return newList;
    });
  };

  const handleDeleteAttributes = (index: number) => {
    setListAttribute((pre: any) => {
      const newList = [...pre];
      newList.splice(index, 1);
      return mapAttribute(newList, undefined, -1, undefined);
    });
  };

  const handleAddAttributes = () => {
    setListAttribute((pre) => mapAttribute(pre, undefined, pre.length, []));
  };

  const isValidateAttribute = (): boolean => {
    return listAttribute.some((item, i) => {
      if (
        item.attribute_id &&
        (!item.attributeValue_ids || item.attributeValue_ids?.length == 0)
      ) {
        toastError(`Giá trị thuộc tính thứ ${i + 1} chưa chọn`);
        return true;
      }
    });
  };

  const handleChangeCategory = (value: any) => {
    if (value) {
      mutateCategoryValue.mutate(value);
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

  return (
    <Space className="pt-7 pb-7 px-8 w-full" direction="vertical">
      <Space direction="vertical" size={2}>
        <Space
          className="text-[#7E84A3] cursor-pointer"
          onClick={() => navigate(PATH.product)}
        >
          <RollBackIcon />
          Quay lại
        </Space>
        <Typography.Text className="text-3xl font-bold">
          Thêm sản phẩm
        </Typography.Text>
      </Space>

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
                {/* <Col className="sm:w-full lg:w-1/3 sm:min-w-[256px] lg:min-w-[100px]">
                  <Form.Item
                    label="Số lượng"
                    name={'quantity'}
                    className="w-full mb-1"
                  >
                    <Input placeholder="Nhập số lượng" />
                  </Form.Item>
                </Col> */}
              </Row>
              <Form.Item
                label="Mô tả sản phẩm"
                name={'description'}
                className="my-0"
              >
                <Input.TextArea placeholder="Nhập tên sản phẩm" rows={4} />
              </Form.Item>
            </Space>

            {/* Thông tin thuộc tính */}
            <Divider className="mt-4 mb-1 border" />
            <Space direction="vertical" className="w-full m-0 " size={0}>
              <LableCustom value={'Thông tin thuộc tính'} />
              {listAttribute.map((item, index: number) => (
                <Row
                  justify={'space-between'}
                  className="mb-2 mt-1 w-full"
                  gutter={[15, 5]}
                  key={index}
                >
                  <Col className="sm:w-full lg:w-2/5 sm:min-w-[256px] lg:min-w-[50px]">
                    <Form.Item
                      {...(!isSmallScreen &&
                        index == 0 && { label: 'Tên thuộc tính' })}
                      className="w-full mb-1"
                      // name={`attribute_id_${index}`}
                    >
                      <div>
                        <SelectAddForm
                          size="middle"
                          placeholder={`Chọn thuộc tính`}
                          className="flex-grow"
                          options={listAttribute[index].optionAttribute}
                          value={item?.attribute_id}
                          onChange={(value) => onChangeAttribute(value, index)}
                          handleOnlickAdd={() => {
                            setIsOpen(true);
                            setIsAddAttribute(true);
                            setAttributeSelected(undefined);
                          }}
                        />
                      </div>
                    </Form.Item>
                  </Col>
                  <Col className="sm:w-full lg:w-3/5 sm:min-w-[256px] lg:min-w-[100px]">
                    <Flex align="flex-end" gap={5}>
                      <Form.Item
                        {...(!isSmallScreen &&
                          index == 0 && { label: 'Giá trị thuộc tính' })}
                        className="mb-0 flex-grow"
                        // name={`attribute_value_${index}`}
                      >
                        <div>
                          <SelectAddForm
                            size="middle"
                            placeholder={`Chọn giá trị thuộc tính`}
                            mode="multiple"
                            options={listAttribute[index].optionAttributeValues}
                            value={item?.attributeValue_ids}
                            onChange={(value, option) =>
                              onChangeAttributeValue(option, index)
                            }
                            handleOnlickAdd={() => {
                              if (!listAttribute[index].attribute_id) {
                                toastSucess(
                                  'Vui lòng chọn thuộc tính trước khi thêm giá trị',
                                );
                                return;
                              }
                              setIsOpen(true);
                              setIsAddAttribute(false);
                              setAttributeSelected(item);
                            }}
                            isSort={false}
                          />
                        </div>
                      </Form.Item>

                      <ButtonAction
                        isIcon
                        onClick={() => handleDeleteAttributes(index)}
                      />
                    </Flex>
                  </Col>
                </Row>
              ))}
              <div
                className="max-w-max mt-0 pl-0 pb-4 text-[#515DEF] font-semibold cursor-pointer hover:opacity-50"
                onClick={handleAddAttributes}
              >
                Thêm thuộc tính
              </div>
            </Space>

            {/* Table các sản phẩm chi tiết*/}
            <LableCustom value={'Chi tiết sản phẩm'} />
            <Divider className="mt-0 mb-0 border" />
            <TableAddProductDetail data={dataProDetails} isAdd />
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
                <ButtonCustom
                  size="px-9 py-2"
                  value="Tiếp tục"
                  fill
                  disabled={
                    mutateAddProduct.isPending ||
                    mutateAddProductDetail.isPending ||
                    mutateUploadImage.isPending ||
                    mutateUploadImageDetail.isPending
                  }
                />
              </Col>
            </Row>
          </Flex>
        </Flex>
      </Form>

      <ModalAddAttribute
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isAdd={isAddAttribute}
        attribute={attributeSelected}
        listAttribute={listAttribute}
        optionAttribute={optionAttribute}
      />
    </Space>
  );
};

export default memo(AddProductPage);
