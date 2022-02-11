import ProForm, {
    StepsForm,
    ProFormText,
    ProFormDatePicker,
    ProFormSelect,
    ProFormTextArea,
    ProFormCheckbox,
    ProFormDateRangePicker,
    ProFormInstance,
    ProFormTimePicker,
    ProFormRadio,
} from '@ant-design/pro-form';
import { Button, message, Card, TimePicker, Radio, Spin, Result } from 'antd';
import { useEffect, useRef, useState } from 'react';
import styles from './CreateNotification.less';
import moment from 'moment';
import { listMember } from '@/services/apis/memberApis';
import { createNormalNotification } from '@/services/apis/notificationApis';


export default function CreateNotification({ notificationCate, spaceId }: any) {
    const [blockDisplay, setBlockDisplay] = useState(notificationCate);
    const [value, setValue] = useState(1);
    const [dayOfWeekCate, setDayOfWeekCate] = useState("block");
    const [dayOfMonthCate, setDayOfMonthCate] = useState("none");
    const [members, setMembers] = useState([{ displayName: 'Tất cả', name: 'Tất cả' }]);
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<ProFormInstance>();
    useEffect(() => {
        setBlockDisplay(notificationCate);
    },[notificationCate]);
    useEffect(() => {
        const getListMember = async () => {
            const res = await listMember(spaceId);
            setMembers([...members, ...res.data.members])
        }
        getListMember();
    }, [spaceId]);

    const onChangeCategory = (e: any) => {
        setValue(e.target.value);
        if (e.target.value == 1) {
            setDayOfWeekCate("block");
            setDayOfMonthCate("none");
        } else {
            setDayOfWeekCate("none");
            setDayOfMonthCate("block");
        }
    };
    const waitTime = (time: number = 100) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        });
    };
    return (
        <>
            {blockDisplay == 1 &&
                <Card className={styles.cardStep}>
                    <h3>Thông báo bình thường</h3>
                    <StepsForm<{
                        name: string;
                    }>
                        formRef={formRef}
                        onFinish={async (values: any) => {
                            let dayOfWeek = [];
                            if (dayOfWeekCate == "block") {
                                dayOfWeek = values.dayOfWeek;
                            }
                            const data = {
                                name: values.name,
                                content: values.content,
                                tags: values.tag,
                                dayOfWeek: dayOfWeek,
                                minute: minute,
                                hour: hour,
                                dayOfMonth: day,
                                month: month,
                                year: year,
                                threadId: values.threadId,
                                spaceId: spaceId
                            }
                            setIsLoading(true);
                            await waitTime(2000)
                            const res = await createNormalNotification(data);
                            setIsLoading(false);
                            setBlockDisplay(3);
                        }}
                        formProps={{
                            validateMessages: {
                                required: 'Không được bỏ trống',
                            },
                        }}
                        submitter={{
                            render: (props) => {
                                if (props.step === 0) {
                                    return (
                                        <Button type="primary" onClick={() => props.onSubmit?.()}>
                                            Tiếp theo {'>'}
                                        </Button>
                                    );
                                }

                                if (props.step === 1) {
                                    return [
                                        <Button key="pre" onClick={() => props.onPre?.()}>
                                            Quay lại
                                        </Button>,
                                        <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                                            Tiếp thep {'>'}
                                        </Button>,
                                    ];
                                }

                                return [
                                    <Button key="gotoTwo" onClick={() => props.onPre?.()}>
                                        {'<'} Quay lai
                                    </Button>,
                                    <>
                                        {
                                            !isLoading &&
                                            <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                                                Hoàn thành √
                                            </Button>
                                        }
                                    </>,
                                    <>
                                        {
                                            isLoading &&
                                            <Spin tip="loading">
                                                <Button type="primary" disabled key="goToTree" onClick={() => props.onSubmit?.()}>
                                                    Hoàn thành √
                                                </Button>
                                            </Spin>

                                        }
                                    </>
                                ];
                            },
                        }}
                    >
                        <StepsForm.StepForm<{
                            name: string;
                        }>
                            name="base"
                            title="Nội dung"
                            onFinish={async ({ name }) => {
                                return true;
                            }}
                        >
                            <ProFormText
                                name="name"
                                label="Tên thông báo"
                                width="md"
                                tooltip="VD: Check daily report"
                                placeholder="Tên thông báo"
                                rules={[{ required: true }]}
                            />
                            <ProFormTextArea
                                name="content"
                                label="Nội dung"
                                width="lg"
                                placeholder="Nội dung thông báo"
                                rules={[{ required: true }]}
                            />
                        </StepsForm.StepForm>
                        <StepsForm.StepForm<{
                            checkbox: string;
                        }>
                            name="checkbox"
                            title="Thời gian"
                            onFinish={async () => {
                                const value = formRef.current?.getFieldsValue();
                                setHour(moment(value.time).format('k'));
                                setMinute(moment(value.time).format('m'));
                                if (dayOfMonthCate == "block") {
                                    setDay(moment(value.dayOfMonth).format('D'));
                                    setMonth(moment(value.dayOfMonth).format('M'));
                                    setYear(moment(value.dayOfMonth).format('YYYY'));

                                }
                                return true;
                            }}
                        >
                            <ProFormTimePicker
                                name="time"
                                label="Giờ"
                                width="sm"
                                rules={[{ required: true }]}
                                tooltip="Thời gian mà thông báo được gửi"
                            />
                            <Radio.Group
                                defaultValue="a"
                                buttonStyle="solid"
                                onChange={onChangeCategory}
                                value={value}
                            >
                                <Radio.Button value={1}>Theo ngày trong tuần</Radio.Button>
                                <Radio.Button value={2}>Theo ngày trong tháng</Radio.Button>

                            </Radio.Group>
                            <ProForm.Group
                                style={{ display: dayOfWeekCate }}
                            >
                                <ProFormCheckbox.Group
                                    name="dayOfWeek"
                                    label="Ngày trong tuần"
                                    width="lg"
                                    rules={[{ required: true }]}
                                    tooltip="Các ngày trong tuần mà thông báo được gửi"
                                    initialValue={[{ label: 'Thứ 2', value: 1 }]}
                                    options={[{ label: 'Thứ 2', value: 1 }, { label: 'Thứ 3', value: 2 }, { label: 'Thứ 4', value: 3 }, { label: 'Thứ 5', value: 4 }, { label: 'Thứ 6', value: 5 }, { label: 'Thứ 7', value: 6 }, { label: 'Chủ nhật', value: 7 }].map((item: any) => ({
                                        label: item.label,
                                        value: item.value,

                                    }))}
                                />
                            </ProForm.Group>
                            <ProForm.Group
                                style={{ display: dayOfMonthCate }}
                            >
                                <ProFormDatePicker
                                    name="dayOfMonth"
                                    fieldProps={{
                                        format: 'DD-MM-YYYY',
                                    }}
                                    label="Ngày trong tháng"
                                    initialValue={{ dateMonth: Date.now() }}
                                    rules={[{ required: true }]}
                                />
                            </ProForm.Group>
                        </StepsForm.StepForm>
                        <StepsForm.StepForm
                            name="time"
                            title="Tùy chọn"
                            onFinish={async () => {
                                const value = formRef.current?.getFieldsValue();


                                return true;
                            }}
                        >
                            <ProFormSelect
                                name="tag"
                                label="Tag"
                                fieldProps={{
                                    mode: 'tags',
                                }}
                                width="lg"
                                initialValue={['Tất cả']}
                                options={members.map((item: any) => ({
                                    label: item.displayName,
                                    value: item.name,

                                }))}
                            />
                            <ProFormText
                                name="threadId"
                                label="Thread ID"
                                width="md"
                                tooltip={`Thread bạn muốn bot gửi thông báo. Vào space và gõ thread để nhận được threadID.\n
                                Nếu nhập sai threadID thì thông báo sẽ tự động bị vô hiệu hóa`}
                                placeholder=""
                            />
                        </StepsForm.StepForm>
                    </StepsForm>
                </Card>
            }
            {blockDisplay == 2 &&
                // <Card className={styles.cardStep}>
                //     <h3>Thông báo nhắc nhở</h3>
                //     <StepsForm<{
                //         name: string;
                //     }>
                //         onFinish={async (values) => {


                //             message.success('提交成功');
                //         }}
                //         formProps={{
                //             validateMessages: {
                //                 required: '此项为必填项',
                //             },
                //         }}
                //         submitter={{
                //             render: (props) => {
                //                 if (props.step === 0) {
                //                     return (
                //                         <Button type="primary" onClick={() => props.onSubmit?.()}>
                //                             Tiếp theo {'>'}
                //                         </Button>
                //                     );
                //                 }

                //                 if (props.step === 1) {
                //                     return [
                //                         <Button key="pre" onClick={() => props.onPre?.()}>
                //                             Quay lại
                //                         </Button>,
                //                         <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                //                             Tiếp thep {'>'}
                //                         </Button>,
                //                     ];
                //                 }

                //                 return [
                //                     <Button key="gotoTwo" onClick={() => props.onPre?.()}>
                //                         {'<'} Quay lai
                //                     </Button>,
                //                     <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                //                         Hoàn thanh √
                //                     </Button>,
                //                 ];
                //             },
                //         }}
                //     >
                //         <StepsForm.StepForm<{
                //             name: string;
                //         }>
                //             name="base"
                //             title="Nội dung"
                //             onFinish={async ({ name }) => {
                //                 return true;
                //             }}
                //         >
                //             <ProFormText
                //                 name="name"
                //                 label="Tên thông báo"
                //                 width="md"
                //                 tooltip="VD: Check daily report"
                //                 placeholder="Tên thông báo"
                //                 rules={[{ required: true }]}
                //             />
                //             <ProFormTextArea
                //                 name="content"
                //                 label="Nội dung"
                //                 width="lg"
                //                 placeholder="Nội dung thông báo"
                //                 rules={[{ required: true }]}
                //             />
                //             <ProFormDatePicker name="date" label="日期" />
                //             <ProFormDateRangePicker name="dateTime" label="时间区间" />
                //         </StepsForm.StepForm>
                //         <StepsForm.StepForm<{
                //             checkbox: string;
                //         }>
                //             name="checkbox"
                //             title="Thời gian"
                //         >
                //             <ProFormCheckbox.Group
                //                 name="checkbox"
                //                 label="迁移类型"
                //                 width="lg"
                //                 options={['结构迁移', '全量迁移', '增量迁移', '全量校验']}
                //             />
                //             <ProForm.Group>
                //                 <ProFormText name="dbname" label="业务 DB 用户名" />
                //                 <ProFormDatePicker name="datetime" label="记录保存时间" width="sm" />
                //                 <ProFormCheckbox.Group
                //                     name="checkbox"
                //                     label="迁移类型"
                //                     options={['完整 LOB', '不同步 LOB', '受限制 LOB']}
                //                 />
                //             </ProForm.Group>
                //         </StepsForm.StepForm>
                //         <StepsForm.StepForm name="time" title="Xác nhận">
                //             <ProFormCheckbox.Group
                //                 name="checkbox"
                //                 label="部署单元"
                //                 rules={[
                //                     {
                //                         required: true,
                //                     },
                //                 ]}
                //                 options={['部署单元1', '部署单元2', '部署单元3']}
                //             />
                //             <ProFormSelect
                //                 label="部署分组策略"
                //                 name="remark"
                //                 rules={[
                //                     {
                //                         required: true,
                //                     },
                //                 ]}
                //                 initialValue="1"
                //                 options={[
                //                     {
                //                         value: '1',
                //                         label: '策略一',
                //                     },
                //                     { value: '2', label: '策略二' },
                //                 ]}
                //             />
                //             <ProFormSelect
                //                 label="Pod 调度策略"
                //                 name="remark2"
                //                 initialValue="2"
                //                 options={[
                //                     {
                //                         value: '1',
                //                         label: '策略一',
                //                     },
                //                     { value: '2', label: '策略二' },
                //                 ]}
                //             />
                //         </StepsForm.StepForm>
                //     </StepsForm>
                // </Card>
                <div>
                    <Result
                        title="Tính năng này đang được phát triển"
                    />
                </div>
            }
            {
                blockDisplay == 3 &&
                <div>
                    <Result
                        status="success"
                        title="Thông báo được tạo thành công"
                    />,
                </div>
            }
        </>
    )
}