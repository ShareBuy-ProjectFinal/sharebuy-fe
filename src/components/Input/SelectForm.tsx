import { Select, SelectProps } from 'antd';

const SelectForm = (props: SelectProps) => {
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
      filterSort={(optionA: any, optionB: any) => {
        if (
          typeof optionA?.label === 'number' ||
          typeof optionB?.label === 'number'
        ) {
          return null;
        }
        return (optionA?.label ?? '')
          .toLowerCase()
          .localeCompare((optionB?.label ?? '').toLowerCase());
      }}
      size="large"
      showSearch
      className={`w-full ${props.className}`}
      {...props}
    />
  );
};

export default SelectForm;

{
  /* <SelectForm
size="middle"
className="h-10"
options={optionTrip}
placeholder="Chọn mã chuyến"
onChange={handleChangeTripSelect}
dropdownRender={(menu) => (
  <>
    {menu}
    <div
      className="px-3 py-[5px] text-primary-60 font-bold cursor-pointer hover:opacity-50"
      onClick={() => setIsOpenTripModal(true)}
    >
      Tạo mới
    </div>
  </>/> */
}
