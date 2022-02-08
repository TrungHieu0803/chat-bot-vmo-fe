import { PageContainer } from "@ant-design/pro-layout";
import { Card, Descriptions, Row, Col, List, Input, Button, Modal, Radio, Space } from "antd";
import { useState } from "react";
import CreateNotification from "@/components/CreateNotification/CreateNotification";
import { useParams } from "umi";
import styles from './SpaceDetail.less';

export default function SpaceDetail() {
    const {spaceId}: any = useParams();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [notificationCate, setNotificationCate] = useState(0);
    const [choseCate, setChoseCate] = useState(0);
    const { Search } = Input;
    const onSearch = () => {

    }
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setChoseCate(notificationCate);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    return (
        <div>
            <PageContainer
                fixedHeader
                header={{
                    title: 'Hello',
                }}
                content={
                    <Descriptions column={4} style={{ marginBottom: -16 }}>
                        <Descriptions.Item label="Owner">hieu</Descriptions.Item>
                        <Descriptions.Item label="Admin">
                            <a>421421</a>
                        </Descriptions.Item>
                        <Descriptions.Item label="Thành viên">
                            <a>123</a>
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
                            <CreateNotification notificationCate={choseCate} spaceId={spaceId} />
                        </Col>
                        <Col span={6} pull={18} className={styles.leftContain}>
                            <Search placeholder="Tìm kiếm thông báo" onSearch={onSearch} enterButton className={styles.leftSearch} />
                            <List
                                itemLayout="horizontal"
                                // dataSource={data}
                                renderItem={item => (

                                    <List.Item>
                                        <List.Item.Meta

                                            title={<a href="https://ant.design"></a>}

                                        />
                                    </List.Item>
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