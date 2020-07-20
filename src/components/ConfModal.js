import React from "react";
import { Modal, Button, Container, Row, Col } from "react-bootstrap";

const ConfModal = (props) => {
    return (
        <Modal onHide={() => props.onHide(false)} show={props.show}>
            <Modal.Header closeButton>
                <Modal.Title id="updateModalLabel">
                    Chrome Controller
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you would like to update your settings?</p>
                <p>
                    <b>
                        You may need to refresh the page in order for them to
                        take effect.
                    </b>
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={() =>
                        window.open(
                            "https://chrome.google.com/webstore/detail/chrome-controller/nilnjekagachinflbdkanmblmjpaimhl?hl=en-US",
                            "_blank"
                        )
                    }
                    id="final-submit-rate"
                    variant="primary"
                >
                    <div className="star"></div>
                    Rate!
                    <div className="star"></div>& Submit
                </Button>
                <Button
                    id="final-submit"
                    onClick={async () => await props.onSave()}
                    variant="dark"
                >
                    Submit changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfModal;
