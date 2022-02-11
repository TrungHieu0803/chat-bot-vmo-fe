import { PageContainer } from "@ant-design/pro-layout";
import { Card, Descriptions, Row, Col, List, Input, Button, Modal, Radio, Space, Avatar, Switch } from "antd";
import { useEffect, useState } from "react";
import CreateNotification from "@/components/CreateNotification/CreateNotification";
import Member from "@/components/Member/Member";
import { useParams } from "umi";
import styles from './SpaceDetail.less';
import { getSpaceInfo } from "@/services/apis/spaceApis";
import { getNotifications } from "@/services/apis/notificationApis";
import ListNotification from "@/components/Notification/ListNotification";
export default function SpaceDetail() {
    const { spaceId }: any = useParams();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [notificationCate, setNotificationCate] = useState(0);
    const [choseCate, setChoseCate] = useState(0);
    const [notifications, setNotifications] = useState<API.Notifications>();
    const [role, setRole] = useState('');
    const [spaceDetail, setSpaceDetail] = useState<API.SpaceDetail>();
    const { Search } = Input;
    const onSearch = () => {

    }
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setRole('');
        setChoseCate(notificationCate);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const ownerModal = () => {
        Modal.info({
            title: 'Owner',
            content: (
                <div>
                    <Row>
                        <Col span={20} push={4}>
                            <h4>{spaceDetail?.owner?.displayName}</h4>
                        </Col>
                        <Col span={4} pull={20}>
                            <Avatar src={`${spaceDetail?.owner?.imageUrl}`} />
                        </Col>
                    </Row>,
                </div>
            ),
            onOk() { },
        });
    }
    useEffect(() => {
        const spaceInfo = async () => {
            const res = await getSpaceInfo(spaceId);
            setSpaceDetail(res.data);
        }
        const notifications = async () => {
            const res = await getNotifications(spaceId);
            setNotifications(res.data);
        }
        spaceInfo();
        notifications();

    }, [])

    const handleSelectNotification = (e: any, notificationId: number) =>{

    }

    const handleStatusChange = (e: any, isEnable: boolean) =>{

    }
    return (
        <div>
            <PageContainer
                fixedHeader
                header={{
                    title: `${spaceDetail?.displayName}`,
                }}
                content={
                    <Descriptions column={4} style={{ marginBottom: -16 }}>
                        <Descriptions.Item label="Owner">
                            <a onClick={ownerModal}>{spaceDetail?.owner?.displayName}</a>
                        </Descriptions.Item>
                        <Descriptions.Item label="Admin">
                            <a onClick={(e) => { setRole('admin'); setChoseCate(0) }} >{spaceDetail?.admin}</a>
                        </Descriptions.Item>
                        <Descriptions.Item label="Thành viên">
                            <a onClick={(e) => { setRole('member'); setChoseCate(0) }}>{spaceDetail?.member}</a>
                        </Descriptions.Item>
                        <Descriptions.Item>
                            <Button className={styles.spaceDetailBtn} onClick={showModal}>
                                Tạo thông báo
                            </Button>
                        </Descriptions.Item>

                    </Descriptions>
                }
            >
                <Card>
                    <Row className={styles.spaceDetailContainer}>
                        <Col span={18} push={6} className={styles.rightContain}>
                            {choseCate != 0 && <CreateNotification notificationCate={choseCate} spaceId={spaceId} />}
                            {role != '' && <Member role={role} spaceId={spaceId} />}
                        </Col>
                        <Col span={6} pull={18} className={styles.leftContain}>
                            <Search placeholder="Tìm kiếm thông báo" onSearch={onSearch} enterButton className={styles.leftSearch} />
                            <List
                                itemLayout="horizontal"
                                dataSource={notifications?.notifications}
                                renderItem={item => (
                                    <ListNotification notification={item}/>
                                )}
                            />
                        </Col>
                    </Row>

                </Card>
                <Modal title="Chọn loại thông báo" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <Radio.Group onChange={e => setNotificationCate(e.target.value)} value={notificationCate}>
                        <Space direction="vertical">
                            <Radio value={1}>Thông báo bình thường</Radio>
                            <Radio value={2}>Thông báo nhắc nhở</Radio>
                        </Space>
                    </Radio.Group>
                </Modal>

            </PageContainer>

        </div>
    )
}