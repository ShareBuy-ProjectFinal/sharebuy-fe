import { Select, SelectProps } from 'antd';

interface IProps extends SelectProps {
  handleOnlickAdd: (value?: any) => void;
  isSort?: boolean;
}

const SelectAddForm = (selectProps: IProps) => {
  const { handleOnlickAdd, isSort = true, ...props } = selectProps;
  return (
    <Select
      allowClear
      optionFilterProp="children"
      filterOption={(input: any, option: any) => {
        if (typeof option?.label === 'number') {
          return option.label.toString().includes(input);
        }
        return (option?.label ?? '')
          .toString()
          .toLowerCase()
          .includes(input.toLowerCase());
      }}
      // filterSort={(optionA: any, optionB: any) => {
      //   if (
      //     typeof optionA?.label === 'number' ||
      //     typeof optionB?.label === 'number'
      //   ) {
      //     return null;
      //   }
      //   return (optionA?.label ?? '')
      //     .toLowerCase()
      //     .localeCompare((optionB?.label ?? '').toLowerCase());
      // }}
      {...(isSort && {
        filterSort: (optionA: any, optionB: any) => {
          if (
            typeof optionA?.label === 'number' ||
            typeof optionB?.label === 'number'
          ) {
            return null;
          }
          return (optionA?.label ?? '')
            .toLowerCase()
            .localeCompare((optionB?.label ?? '').toLowerCase());
        },
      })}
      size="large"
      showSearch
      className={`w-full ${selectProps?.className}`}
      dropdownRender={(menu) => (
        <>
          {menu}
          <div
            className="px-3 py-[5px] text-primary-60 font-bold cursor-pointer hover:opacity-50"
            onClick={handleOnlickAdd}
          >
            Tạo mới
          </div>
        </>
      )}
      {...props}
    />
  );
};

export default SelectAddForm;
