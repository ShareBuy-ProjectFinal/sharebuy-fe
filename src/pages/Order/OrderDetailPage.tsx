import { useMutation } from '@tanstack/react-query';
import { Col, Flex, Image, Row, Space, Steps, Typography } from 'antd';
import OrderApis, { StatusOrder } from 'apis/OrderApis';
import { RollBackIcon } from 'assets/svgs';
import SpaceCustom from 'components/Space/SpaceCustom';
import LableCustom from 'components/Text/LableCustom';
import TextCustom from 'components/Text/TextCustom';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import formatNumber, { formatDate, generateUUID } from 'utils/function';

interface ICurrentStep {
  current: number;
  status: 'finish' | 'error' | 'wait' | 'process' | undefined;
}

const OrderDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [itemSteps, setItemSteps] = React.useState<any[]>([]);
  const [currentStep, setCurrentStep] = React.useState<ICurrentStep>({
    current: 0,
    status: 'finish',
  });

  const mutateGetOrderById = useMutation({
    mutationFn: OrderApis.getById,
    onSuccess: (data) => {
      //   console.log(data);
      if (data.status == 'CANCELED') {
        setItemSteps([
          { title: 'Đang chờ xác nhận' },
          { title: 'Đang chuẩn bị' },
          { title: 'Đã huỷ' },
        ]);
        setCurrentStep({ current: 2, status: 'error' });
      } else {
        setItemSteps(
          [
            { title: 'Đang chờ xác nhận' },
            { title: 'Đang chuẩn bị' },
            { title: 'Đang giao hàng' },
            { title: 'Đã nhận hàng' },
          ].map((item, index) =>
            index == calculatorStatus(data.status)
              ? { ...item, status: 'process' }
              : item,
          ),
        );
        setCurrentStep({
          current: calculatorStatus(data.status),
          status: 'process',
        });
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    mutateGetOrderById.mutate({ orderId: id });
  }, []);

  const addressToString = (address: any) => {
    return `${address?.detail}, ${address?.ward.ward_name}, ${address?.district.district_name}, ${address?.province.province_name}`;
  };

  const calculatorStatus = (status: StatusOrder) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'PREPARING':
        return 1;
      case 'DELIVERY':
        return 2;
      case 'COMPLETED':
        return 3;
      default:
        return -1;
    }
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
        <Typography.Text className="text-3xl font-bold">
          {`Chi tiết đơn hàng: #${mutateGetOrderById.data?._id.slice(-7)}`}
        </Typography.Text>
      </Flex>
      {/* <div className="bg-white p-5 w-full rounded-lg shadow-md"> */}
      <SpaceCustom width="100%">
        <Row justify={'space-between'} className="w-full" gutter={[10, 10]}>
          <FormatContent
            lable="Khách hàng"
            value={mutateGetOrderById.data?.address?.userInfo?.full_name}
          />
          <FormatContent
            lable="Ngày đặt"
            value={formatDate(mutateGetOrderById.data?.createdAt)}
          />
          <FormatContent
            lable="Số điện thoại"
            value={mutateGetOrderById.data?.address?.phone_number}
          />
          <FormatContent
            lable="Địa chỉ"
            value={addressToString(mutateGetOrderById.data?.address)}
          />
        </Row>
      </SpaceCustom>
      {/* </div> */}
      <SpaceCustom direction="vertical" width="100%">
        <TextCustom
          value={`Tiến độ đơn hàng: `}
          className="font-bold text-lg text-black mr-1"
        />
        <Steps
          className="mt-1"
          current={currentStep.current}
          status={currentStep.status}
          items={itemSteps}
        />
      </SpaceCustom>
      <Flex className="w-full" gap={25}>
        <SpaceCustom direction="vertical" width="60%" className="h-max">
          {(mutateGetOrderById.data?.order_items || []).map(
            (order: any, index: number) => (
              <Space align="center" key={generateUUID()}>
                <Image
                  src={order?.cart_item?.product_detail?.image}
                  width={100}
                  height={105}
                  className="rounded-md border-[##bfc1c2] border"
                />
                <Flex justify="space-between" vertical gap={5}>
                  <TextCustom
                    value={`${order?.cart_item?.product_detail?.name}`}
                    color="text-[#131523]"
                  />
                  <TextCustom
                    value={(
                      order?.cart_item?.product_detail
                        ?.custom_attribute_values || []
                    )
                      .map((item: any) => item.value)
                      .join(', ')}
                  />
                  <TextCustom
                    value={`${order?.cart_item?.product_detail?.price} x${order?.cart_item?.quantity}`}
                  />
                </Flex>
              </Space>
            ),
          )}
        </SpaceCustom>
        <SpaceCustom
          direction="vertical"
          width="40%"
          className="h-max"
          size={0}
        >
          <Row justify={'space-between'} className="!m-0 !p-0">
            <LableCustom value={`Tiền sản phẩm: `} />
            <TextCustom
              value={formatNumber(
                mutateGetOrderById.data?.total_amount -
                  mutateGetOrderById.data?.fee_ship,
              )}
            />
          </Row>
          <Row justify={'space-between'} className="!m-0 !p-0">
            <LableCustom value={`Phí vận chuyển: `} />
            <TextCustom
              value={formatNumber(mutateGetOrderById.data?.fee_ship)}
            />
          </Row>
          <div className="border-2 mb-2" />
          <Row justify={'space-between'}>
            <LableCustom value={`Tổng tiền: `} />
            <TextCustom
              value={formatNumber(mutateGetOrderById.data?.total_amount)}
            />
          </Row>
        </SpaceCustom>
      </Flex>
    </Space>
  );
};

export default OrderDetailPage;

const FormatContent = (props: { lable: any; value: any; span?: number }) => {
  const { lable, value, span } = props;
  return (
    <Col className="w-max">
      <Row>
        <TextCustom
          value={`${lable}: `}
          className="font-bold text-lg text-black mr-1"
        />
        <TextCustom value={value} className="font-medium text-lg" />
      </Row>
    </Col>
  );
};
