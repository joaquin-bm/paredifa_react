import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Toast from "react-bootstrap/Toast";
import { useContext } from "react";
import ThemeContextMsg from "../Context/ContextMessage";
import ThemeContextMsgInfo from "../Context/ContextMsg";
const Message = () => {
  const { msgShow, setMsgShow } = useContext(ThemeContextMsg);
  const { msgInfo, setMsgInfo } = useContext(ThemeContextMsgInfo);



  return (
    <>
      <Row>
        <Col xs={6}>
          <Toast
            className="tostada"
            bg={msgInfo.bg}
            onClose={() => setMsgShow(false)}
            show={msgShow}
            delay={4000}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto">{msgInfo.header}</strong>
            </Toast.Header>
            <Toast.Body>{msgInfo.body}</Toast.Body>
          </Toast>
        </Col>
        <Col xs={6}></Col>
      </Row>
    </>
  );
};

export default Message;