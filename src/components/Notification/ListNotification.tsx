import { Button, List, Popover } from "antd";
import { useState } from "react";
import styles from './Notification.less';
import { updateStatus } from "@/services/apis/notificationApis";
import { MoreOutlined } from "@ant-design/icons";

export default function ListNotification({ notification }: any) {
    const [isEnable, setIsEnable] = useState(notification.isEnable);
    const handleStatusChange = async (e: any, isEnable: boolean) => {
        setIsEnable(isEnable);
        const data = { id: notification.id, isEnable: isEnable };
        await updateStatus(data);
    }
    const content = (
        <div>
            <p>Content</p>
            <p>Content</p>
        </div>
    );
    return (
        <>
            <List.Item className={styles.listNotification}>
                <List.Item.Meta
                    title={<a >{notification.name}</a>}
                />
                {isEnable ? <Button onClick={(e) => handleStatusChange(e, !isEnable)}>Tắt</Button> : <Button onClick={(e) => handleStatusChange(e, !isEnable)} type="primary">Bật</Button>}
                {/* <Popover content={content} title="Title">
                    <MoreOutlined />
                </Popover> */}
            </List.Item>
        </>
    )
}