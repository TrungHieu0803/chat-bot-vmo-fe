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
} from '@ant-design/pro-form';
import { Button, message, Card, TimePicker } from 'antd';
import { useEffect, useRef, useState } from 'react';
import styles from './CreateNotification.less';
import moment from 'moment';
import { listMember } from '@/services/apis/memberApis';


export default function CreateNotification({ notificationCate, spaceId }: any) {
    const [members, setMembers] = useState([]);
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
    const formRef = useRef<ProFormInstance>();
    useEffect(() => {
        const getListMember = async () => {
            const res = await listMember(spaceId);
            setMembers(res.data.members)
        }
        getListMember();
    }, [spaceId]);
    return (
        <>
            {notificationCate == 1 &&
                <Card className={styles.cardStep}>
                    <h3>Thông báo bình thường</h3>
                    <StepsForm<{
                        name: string;
                    }>
                        formRef={formRef}
                        onFinish={async (values: any) => {
                            const data = {
                                name: values.name,
                                content: values.content,
                                tag: values.tag,
                                dayOfWeek: values.dayOfWeek,
                                minute: minute,
                                hour: hour,
                                threadId: values.threadId
                            }
                            console.log(data);
                            

                            message.success('Tạo thông báo thành công');
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
                                    <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                                        Hoàn thành √
                                    </Button>,
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
                                console.log(formRef.current?.getFieldsValue());
                                
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
                            {/* <ProFormDatePicker name="date" label="日期" />
                            <ProFormDateRangePicker name="dateTime" label="时间区间" /> */}
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
                                return true;
                            }}
                        >
                            <ProFormCheckbox.Group
                                name="dayOfWeek"
                                label="Ngày trong tuần"
                                width="lg"
                                rules={[{ required: true }]}
                                tooltip="Các ngày trong tuần mà thông báo được gửi"
                                options={[{ label: 'Thứ 2', value: 1 }, { label: 'Thứ 3', value: 2 }, { label: 'Thứ 4', value: 3 }, { label: 'Thứ 5', value: 4 }, { label: 'Thứ 6', value: 5 }, { label: 'Thứ 7', value: 6 }, { label: 'Chủ nhật', value: 7 }].map((item: any) => ({
                                    label: item.label,
                                    value: item.value,

                                }))}
                            />

                            <ProForm.Group>

                                <ProFormTimePicker
                                    name="time"
                                    label="Giờ"
                                    width="sm"
                                    rules={[{ required: true }]}
                                    tooltip="Thời gian mà thông báo được gửi"
                                />

                                <ProFormDatePicker
                                    name="endDate"
                                    label="Ngày kết thúc"
                                    width="sm"
                                    tooltip="Nếu không chọn ngày kết thúc thì thông báo chỉ dừng khi bị xóa hoặc bị vô hiệu hóa bởi owner hoặc admin"
                                />

                            </ProForm.Group>
                        </StepsForm.StepForm>
                        <StepsForm.StepForm
                            name="time"
                            title="Tùy chọn"
                            onFinish={async () => {
                                const value = formRef.current?.getFieldsValue();
                                console.log(value)

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
                                tooltip="Thread bạn muốn bot gửi thông báo. Vào space và gõ thread để nhận được thread ID"
                                placeholder=""
                            />
                        </StepsForm.StepForm>
                    </StepsForm>
                </Card>
            }
            {notificationCate == 2 &&
                <Card className={styles.cardStep}>
                    <h3>Thông báo nhắc nhở</h3>
                    <StepsForm<{
                        name: string;
                    }>
                        onFinish={async (values) => {
                            console.log(values);

                            message.success('提交成功');
                        }}
                        formProps={{
                            validateMessages: {
                                required: '此项为必填项',
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
                                    <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                                        Hoàn thanh √
                                    </Button>,
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
                                console.log(name);

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
                            <ProFormDatePicker name="date" label="日期" />
                            <ProFormDateRangePicker name="dateTime" label="时间区间" />
                        </StepsForm.StepForm>
                        <StepsForm.StepForm<{
                            checkbox: string;
                        }>
                            name="checkbox"
                            title="Thời gian"
                        >
                            <ProFormCheckbox.Group
                                name="checkbox"
                                label="迁移类型"
                                width="lg"
                                options={['结构迁移', '全量迁移', '增量迁移', '全量校验']}
                            />
                            <ProForm.Group>
                                <ProFormText name="dbname" label="业务 DB 用户名" />
                                <ProFormDatePicker name="datetime" label="记录保存时间" width="sm" />
                                <ProFormCheckbox.Group
                                    name="checkbox"
                                    label="迁移类型"
                                    options={['完整 LOB', '不同步 LOB', '受限制 LOB']}
                                />
                            </ProForm.Group>
                        </StepsForm.StepForm>
                        <StepsForm.StepForm name="time" title="Xác nhận">
                            <ProFormCheckbox.Group
                                name="checkbox"
                                label="部署单元"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                                options={['部署单元1', '部署单元2', '部署单元3']}
                            />
                            <ProFormSelect
                                label="部署分组策略"
                                name="remark"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                                initialValue="1"
                                options={[
                                    {
                                        value: '1',
                                        label: '策略一',
                                    },
                                    { value: '2', label: '策略二' },
                                ]}
                            />
                            <ProFormSelect
                                label="Pod 调度策略"
                                name="remark2"
                                initialValue="2"
                                options={[
                                    {
                                        value: '1',
                                        label: '策略一',
                                    },
                                    { value: '2', label: '策略二' },
                                ]}
                            />
                        </StepsForm.StepForm>
                    </StepsForm>
                </Card>
            }
        </>
    )
}