import { useMutation } from '@tanstack/react-query';
import {
  Col,
  Form,
  Input,
  Modal,
  ModalProps,
  Radio,
  Row,
  Space,
  Spin,
  Typography,
} from 'antd';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import axiosClient from 'apis/setup/axiosClient';
import Button from 'components/Button/Button';
import ButtonAction from 'components/Button/ButtonAction';
import ExportIcon from 'components/Icons/ExportIcon';
import { icons } from 'utils/icons';
import { IHeader, TDownLoadTemplate } from 'components/Import/ModalImport';
import { ColumnsTypeCustom } from 'interfaces/Table/ColumnsTypeCustom';
import { DEFAULT_PAGE_SIZE } from 'utils/constants';
import formatNumber, { formatDate } from 'utils/function';
import { EditIcon } from 'assets/svgs';
import { UploadApis } from 'apis/UploadApis';
import { toastError, toastSucess } from 'utils/toats';
import { Upload } from 'components/Upload/Upload';
import TableCustom from 'components/Table/TableCustom';

const { SaveTwoTone, CloseCircleTwoTone } = icons;

export enum IUploadModules {
  EDIT = 'EDIT',
  DETAIL = 'DETAIL',
  DOWNLOAD = 'DOWNLOAD',
}

type IUploadModal = {
  importId?: string;
  downloadTemplate: TDownLoadTemplate;
  cancelTitle?: string;
  okTitle?: string;
  modules?: IUploadModules[];
  unitTable?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch?: any;
  handleCancel?: any;
  handleEdit?: (record: any, index: number) => void;
  handleSave?: (record: any, index: number) => void;
  handleConfirm?: (data: any) => void;
} & ModalProps;

const { Text } = Typography;

export const UploadModal = memo(
  ({ modules = [], unitTable, ...props }: IUploadModal) => {
    const [form] = Form.useForm();

    const [fileName, setFileName] = useState(''),
      [formData, setFormData] = useState<FormData>(),
      [columns, setColumns] = useState<ColumnsTypeCustom>([]),
      [page, setPage] = useState({ page: 1, pageSize: DEFAULT_PAGE_SIZE }),
      [key, setKey] = useState(Date.now()),
      [dataImport, setDataImport] = useState<any>([]),
      [selectedIndex, setSelectedIndex] = useState(-1),
      [header, setHeader] = useState<{
        dataIndexRow: string[];
        headerRowString: string[];
      }>({
        dataIndexRow: [],
        headerRowString: [],
      }),
      [selectedRadioVal, setSelectedRadioVal] = useState<number>(1);

    const {
      open,
      importId,
      cancelTitle = 'Hủy',
      okTitle = 'Xác nhận',
      downloadTemplate,
      setOpen,
      refetch,
      handleCancel,
      handleEdit,
      handleSave,
      handleConfirm,
    } = props;

    const handleUploadFile = useCallback(
      (data: any, header: IHeader, file: File) => {
        try {
          const { dataIndexRow, headerRow: headerRowString } = header;

          const newData = data.map((item: any, id: number) => {
            return {
              id: id,
              ...Object.keys(item).reduce((acc: any, key: any, index) => {
                try {
                  let keyMap: any = {};

                  if (key.toLowerCase() === 'stt') keyMap = {};
                  else
                    keyMap = {
                      [key]: dataIndexRow[index],
                    };

                  if (!Object.keys(keyMap).length) return acc;

                  const newKey = keyMap[key] || key;
                  acc[newKey] = item[key];

                  return acc;
                } catch (err) {
                  console.log(err);
                  return acc;
                }
              }, {}),
            };
          });

          const newColumns: ColumnsTypeCustom = [
            {
              title: 'STT',
              width: 50,
              render: (_: any, __: any, index: number) =>
                index + 1 + page.pageSize * (page.page - 1),
            },
            ...headerRowString.map((item: any, index: number) => {
              return {
                title: <p className="w-max">{item}</p>,
                dataIndex: dataIndexRow[index],
                className: 'w-max min-w-max',
                width: 200,
                render(value: any) {
                  let newValue = value;

                  if (
                    dataIndexRow[index].toString().includes('amt') ||
                    dataIndexRow[index].toString().includes('expected_revenue')
                  )
                    newValue = formatNumber(newValue);
                  else if (dataIndexRow[index].toString().includes('date'))
                    newValue = formatDate(value, 'DD/MM/YYYY HH:mm:ss');

                  return newValue;
                },
              };
            }),
          ];

          const formData = new FormData();
          formData.append('file', file);

          setFormData(formData);
          setColumns(newColumns);
          setDataImport(newData);
          setHeader({
            dataIndexRow: dataIndexRow,
            headerRowString: headerRowString,
          });
        } catch (err) {
          console.log(err);
        }
      },
      [page.page, page.pageSize],
    );

    const operation: ColumnsTypeCustom = useMemo(() => {
      return [
        {
          fixed: 'right',
          align: 'center',
          width: 50,
          render: (_: any, record: any, index: number) =>
            modules.includes(IUploadModules.EDIT) && selectedIndex === index ? (
              <Space size={'middle'} className="text-lg ">
                <ButtonAction
                  tooltip="Lưu"
                  onClick={() => handleSaveRow(record, index)}
                >
                  <SaveTwoTone style={{ fontSize: 20 }} />
                </ButtonAction>
                <ButtonAction
                  tooltip="Huỷ"
                  onClick={() => handleCancelRow(record, index)}
                >
                  <CloseCircleTwoTone style={{ fontSize: 20 }} />
                </ButtonAction>
              </Space>
            ) : (
              <Space size={'middle'} className="text-lg ">
                <ButtonAction
                  tooltip="Chỉnh sửa"
                  onClick={() => handleEditRow(record, index)}
                >
                  <EditIcon />
                </ButtonAction>
              </Space>
            ),
        },
      ];
    }, [selectedIndex]);

    useEffect(() => {
      const { dataIndexRow, headerRowString } = header;

      if (
        dataImport.length <= 0 ||
        dataIndexRow.length <= 0 ||
        headerRowString.length <= 0 ||
        modules.length <= 0
      )
        return;

      const newColumns: ColumnsTypeCustom = [
        {
          title: 'STT',
          width: 50,
          render: (_: any, __: any, index: number) =>
            index + 1 + page.pageSize * (page.page - 1),
        },
        ...headerRowString.map((item: any, index: number) => {
          return {
            key: index,
            title: <p className="w-max">{item}</p>,
            dataIndex: dataIndexRow[index],
            className: 'w-max min-w-max',
            width: 200,
            render(value: any, _: any, rowIndex: number) {
              return modules.includes(IUploadModules.EDIT) &&
                selectedIndex === rowIndex ? (
                <Form.Item
                  name={dataIndexRow[index]}
                  initialValue={value}
                  className="m-0"
                >
                  <Input
                    allowClear
                    placeholder="Nhập giá trị"
                    defaultValue={value}
                  />
                </Form.Item>
              ) : (
                value
              );
            },
          };
        }),
        ...(selectedRadioVal === 2 ? operation : []),
      ];

      setColumns(newColumns);
    }, [selectedIndex, dataImport, header, selectedRadioVal, modules]);

    const handleEditRow = (record: any, index: number) => {
      setSelectedIndex(index);
      form.resetFields();

      if (handleEdit) handleEdit(record, index);
    };

    const handleSaveRow = (record: any, index: number) => {
      setSelectedIndex(-1);

      const valueForm = form.getFieldsValue();
      const newData = dataImport.map((item: any, dataIndex: number) =>
        dataIndex === index ? { ...record, ...valueForm } : item,
      );

      setDataImport(newData);
      form.resetFields();

      if (handleSave) handleSave(record, index);
    };

    const handleCancelRow = (record: any, index: number) => {
      setSelectedIndex(-1);
      form.resetFields();
      setFormData(undefined);
      setDataImport([]);

      if (handleCancel) return handleCancel(record, index);
    };

    useEffect(() => {
      setColumns((prev) =>
        prev.map((item) =>
          item.title?.toString().toLowerCase() === 'stt'
            ? {
                ...item,
                render: (_, __, index) =>
                  index + 1 + page.pageSize * (page.page - 1),
              }
            : item,
        ),
      );
    }, [page]);

    useEffect(() => {
      if (open) {
        setFormData(undefined);
        setColumns([]);
        setPage({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
        setDataImport([]);
        setKey(Date.now());
      }

      setFileName('');
    }, [open]);

    const handleDownloadFileTemplate = useCallback(() => {
      UploadApis.downloadTemplate(downloadTemplate);
    }, [downloadTemplate]);

    const handleOnCancel = () => {
      setOpen(false);
      setDataImport([]);
      setFormData(undefined);
      setFileName('');
      setKey(Date.now());
    };

    const { isPending: isUploadDataPending, mutate: uploadData } = useMutation({
      mutationFn: (params: any) =>
        axiosClient.post(
          `${process.env.REACT_APP_API_BASE_URL}/import/upload/${importId}` as string,
          params,
        ),
      onSuccess: (response) => {
        console.log('response', response);
        if (typeof refetch !== 'undefined') refetch();
        handleOnCancel();
        toastSucess(response?.data?.message ?? 'Tải dữ liệu thành công');
      },
      onError: (error: any) => {
        toastError(error?.response?.data?.message ?? 'Tải dữ liệu thất bại!');
      },
    });

    const handleConfirmClick = useCallback(() => {
      if (handleConfirm) {
        handleConfirm(dataImport);
        return;
      }

      if (!formData) return;
      uploadData(formData);
    }, [formData, uploadData, dataImport]);

    if (!open) return null;

    return (
      <Form form={form} onFinish={handleConfirmClick}>
        <Modal
          classNames={{
            content: '!p-0',
            header:
              '!px-[24px] !pt-[20px] !pb-[8px] !border-sub !border-solid !border-b-[1px]',
            body: '!px-[24px] !pb-[20px]',
            footer: '!px-[24px] !py-[20px] !bg-rowTable !rounded-b-[8px]',
          }}
          className="!w-[70%] !max-w-[70%]"
          footer={() => (
            <Row gutter={[8, 16]} justify={'end'} align={'middle'}>
              <Col>
                <Button
                  title={cancelTitle}
                  fill
                  customClass="!bg-rowTable !border-transparent !text-neutral-30"
                  handleOnclick={handleOnCancel}
                />
              </Col>
              <Col>
                <Button
                  title={okTitle}
                  fill
                  type="submit"
                  handleOnclick={handleConfirmClick}
                />
              </Col>
            </Row>
          )}
          onCancel={handleOnCancel}
          {...props}
        >
          {modules.includes(IUploadModules.EDIT) && (
            <Radio.Group
              buttonStyle="solid"
              defaultValue={selectedRadioVal}
              onChange={(e) => setSelectedRadioVal(e.target.value)}
              className="mb-[12px]"
            >
              <Radio value={1}>Import file</Radio>
              <Radio value={2}>Điều chỉnh trên bảng</Radio>
            </Radio.Group>
          )}
          <Row gutter={[8, 16]} justify={'space-between'}>
            <Col className="flex-[33.33%]">
              <Upload
                keyUpload={{ state: key, setState: setKey }}
                fileName={fileName}
                setFileName={setFileName}
                setData={handleUploadFile}
              />
            </Col>
            <Col>
              <Button
                title="Tải mẫu"
                iconBefore={<ExportIcon />}
                customClass="!mt-0"
                handleOnclick={handleDownloadFileTemplate}
              />
            </Col>
          </Row>
          <Row className="mt-[10px]">
            <Col className="w-full">
              <Form form={form} className="w-full">
                <div className="text-end pb-2">
                  {unitTable && <Text>{unitTable}</Text>}
                </div>
                <Spin spinning={isUploadDataPending}>
                  <TableCustom
                    rowKey={(record: any) => record.id}
                    columns={columns}
                    dataSource={dataImport}
                    scroll={{ x: 'max-content' }}
                    pagination={{
                      current: page.page,
                      pageSize: page.pageSize,
                      total: dataImport.length,
                      onChange(page, pageSize) {
                        setPage({ page, pageSize });
                      },
                    }}
                  />
                </Spin>
              </Form>
            </Col>
          </Row>
        </Modal>
      </Form>
    );
  },
);
