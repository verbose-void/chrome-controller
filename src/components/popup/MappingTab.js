import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../assets/styles/controllers.css";
import controllers from "../../assets/data/controllersList";
import { consoleLog } from "../../utils/debuggingFuncs";

const Option = (props) => {
    return (
        <Row className="setting">
            <Col>
                <p className="mappingLabel">{props.title}</p>
            </Col>
            <Col>
                <select
                    onChange={(e) => props.onChange(e.target.value)}
                    defaultValue={props.value}
                >
                    {props.options.map((opt, index) => {
                        return (
                            <option value={opt.value} key={index}>
                                {opt.title}
                            </option>
                        );
                    })}
                </select>
            </Col>
        </Row>
    );
};

const ControllerOption = (props) => {
    const active = props.activeController == props.key_ ? true : false;
    const img = controllers[props.key_].img;

    return (
        <div
            id={props.id}
            onClick={() => props.onClick(props.key_)}
            className={`controller ${active ? "active" : ""}`}
        >
            {img ? <img src={img} /> : <p>Not listed</p>}
        </div>
    );
};

const noneOption = { title: "NONE", value: "none" };
const axisTemplate = () => {
    return [
        { title: "Scroll", value: "scroll" },
        { title: "Move Cursor", value: "moveCursor" },
        noneOption,
    ];
};

const dPadTemplate = () => {
    return [
        { title: "Scroll", value: "scroll" },
        { title: "Move Cursor", value: "moveCursor" },
        { title: "Jump Select", value: "autoCursorSelect" },
        noneOption,
    ];
};

const buttonTemplate = () => {
    return [
        { value: "click", title: "Click" },
        { value: "newTab", title: "New Tab" },
        { value: "closeTab", title: "Close tab" },
        { value: "historyBack", title: "History-back" },
        { value: "historyForward", title: "History-forward" },
        { value: "tabLeft", title: "Tab-left" },
        { value: "tabRight", title: "Tab-right" },
    ];
};

const videoTemplate = () => {
    return [
        { value: "videoScreenSize", title: "Video-screen size" },
        { value: "videoPlayPause", title: "Video-play/pause" },
        { value: "videoDisplayTime", title: "Video-display time" },
    ];
};

const keyboardTemplate = () => {
    return [
        { value: "space", title: "Space" },
        { value: "backspace", title: "Backspace" },
        { value: "enter", title: "Enter" },
        { value: "clear", title: "Clear" },
        { value: "close", title: "Close" },
    ];
};

const buttonToControllerMap = {
    xbox: {
        B0: "A",
        B1: "B",
        B2: "X",
        B3: "Y",
        B4: "LB",
        B5: "RB",
        B6: "LT",
        B7: "RT",
        B8: "View",
        B9: "Menu",
    },
    ps4: {
        B0: "✕",
        B1: "𐩒",
        B2: "◻",
        B3: "△",
        B4: "L1",
        B5: "R1",
        B6: "L2",
        B7: "R2",
        B8: "Share",
        B9: "Option",
    },
};

const buttonName = (map, controller, key) => {
    try {
        return map[controller][key];
    } catch (e) {
        return key;
    }
};

const MappingTab = (props) => {
    const { state, dispatch } = props;
    const { activeController } = state.controller;
    return (
        <Container>
            <div id="mappings-container" className="page">
                <h1 style={{ marginLeft: "8px" }}>
                    CONTROLLER TYPE
                    <a className="sec-foot-note">
                        Your selection only changes the names of the buttons.
                    </a>
                </h1>

                <Row className="controllersSelection__container">
                    <Col>
                        <ControllerOption
                            onClick={(name) =>
                                dispatch({
                                    type: "setController",
                                    payload: name,
                                })
                            }
                            key_="xbox"
                            activeController={activeController}
                        />
                    </Col>
                    <Col>
                        <ControllerOption
                            onClick={(name) =>
                                dispatch({
                                    type: "setController",
                                    payload: name,
                                })
                            }
                            key_="ps4"
                            activeController={activeController}
                        />
                    </Col>
                    <Col>
                        <ControllerOption
                            onClick={(name) =>
                                dispatch({
                                    type: "setController",
                                    payload: name,
                                })
                            }
                            key_="notListed"
                            id="notListed"
                            activeController={activeController}
                        />
                    </Col>
                </Row>

                {state.controller.activeController == "notListed" && (
                    <div>
                        <p>
                            Find your controller's button numbering
                            <a
                                href="https://html5gamepad.com/"
                                target="__blank"
                                id="gamepad-api-button"
                            >
                                {" "}
                                here
                            </a>
                            .
                        </p>
                    </div>
                )}

                <div className="mapping-menu-global">
                    <h1>AXIS</h1>
                    <Option
                        onChange={(payload) =>
                            dispatch({
                                type: "leftStick",
                                payload,
                            })
                        }
                        value={state.axis.leftStick}
                        title="Left stick"
                        options={axisTemplate()}
                    />
                    <Option
                        onChange={(payload) =>
                            dispatch({
                                type: "rightStick",
                                payload,
                            })
                        }
                        value={state.axis.rightStick}
                        title="Right stick"
                        options={axisTemplate()}
                    />

                    <h1>BUTTONS</h1>
                    <Option
                        onChange={(payload) =>
                            dispatch({
                                type: "dPad",
                                payload,
                            })
                        }
                        value={state.buttons.dPad}
                        title="D-Pad"
                        options={dPadTemplate()}
                    />
                    <Option
                        onChange={(payload) =>
                            dispatch({
                                type: "buttonsB0",
                                payload,
                            })
                        }
                        value={state.buttons[0]}
                        title={buttonName(
                            buttonToControllerMap,
                            activeController,
                            "B0"
                        )}
                        options={[
                            ...buttonTemplate(),
                            ...videoTemplate(),
                            noneOption,
                        ]}
                    />
                    <Option
                        onChange={(payload) =>
                            dispatch({
                                type: "buttonsB1",
                                payload,
                            })
                        }
                        value={state.buttons[1]}
                        title={buttonName(
                            buttonToControllerMap,
                            activeController,
                            "B1"
                        )}
                        options={[
                            ...buttonTemplate(),
                            ...videoTemplate(),
                            noneOption,
                        ]}
                    />
                    <Option
                        onChange={(payload) =>
                            dispatch({
                                type: "buttonsB2",
                                payload,
                            })
                        }
                        value={state.buttons[2]}
                        title={buttonName(
                            buttonToControllerMap,
                            activeController,
                            "B2"
                        )}
                        options={[
                            ...buttonTemplate(),
                            ...videoTemplate(),
                            noneOption,
                        ]}
                    />
                    <Option
                        onChange={(payload) =>
                            dispatch({
                                type: "buttonsB3",
                                payload,
                            })
                        }
                        value={state.buttons[3]}
                        title={buttonName(
                            buttonToControllerMap,
                            activeController,
                            "B3"
                        )}
                        options={[
                            ...buttonTemplate(),
                            ...videoTemplate(),
                            noneOption,
                        ]}
                    />
                    <Option
                        onChange={(payload) =>
                            dispatch({
                                type: "buttonsB9",
                                payload,
                            })
                        }
                        value={state.buttons[9]}
                        title={buttonName(
                            buttonToControllerMap,
                            activeController,
                            "B9"
                        )}
                        options={[...buttonTemplate(), noneOption]}
                    />
                    <Option
                        onChange={(payload) =>
                            dispatch({
                                type: "buttonsB8",
                                payload,
                            })
                        }
                        value={state.buttons[8]}
                        title={buttonName(
                            buttonToControllerMap,
                            activeController,
                            "B8"
                        )}
                        options={[...buttonTemplate(), noneOption]}
                    />

                    <h1>TRIGGERS</h1>
                    <Option
                        onChange={(payload) =>
                            dispatch({
                                type: "triggersB4",
                                payload,
                            })
                        }
                        value={state.triggers[4]}
                        title={buttonName(
                            buttonToControllerMap,
                            activeController,
                            "B4"
                        )}
                        options={[...buttonTemplate(), noneOption]}
                    />
                    <Option
                        onChange={(payload) =>
                            dispatch({
                                type: "triggersB6",
                                payload,
                            })
                        }
                        value={state.triggers[6]}
                        title={buttonName(
                            buttonToControllerMap,
                            activeController,
                            "B6"
                        )}
                        options={[...buttonTemplate(), noneOption]}
                    />
                    <Option
                        onChange={(payload) =>
                            dispatch({
                                type: "triggersB7",
                                payload,
                            })
                        }
                        value={state.triggers[7]}
                        title={buttonName(
                            buttonToControllerMap,
                            activeController,
                            "B7"
                        )}
                        options={[...buttonTemplate(), noneOption]}
                    />
                    <Option
                        onChange={(payload) =>
                            dispatch({
                                type: "triggersB5",
                                payload,
                            })
                        }
                        value={state.triggers[5]}
                        title={buttonName(
                            buttonToControllerMap,
                            activeController,
                            "B5"
                        )}
                        options={[...buttonTemplate(), noneOption]}
                    />

                    <h1>
                        KEYBOARD
                        <a className="sec-foot-note">
                            These mappings take precedence when the keyboard is
                            open.
                        </a>
                    </h1>
                    <Option
                        onChange={(payload) =>
                            dispatch({
                                type: "keyboardB0",
                                payload,
                            })
                        }
                        value={state.keyboard[0]}
                        title={buttonName(
                            buttonToControllerMap,
                            activeController,
                            "B0"
                        )}
                        options={[...keyboardTemplate(), noneOption]}
                    />
                    <Option
                        onChange={(payload) =>
                            dispatch({
                                type: "keyboardB1",
                                payload,
                            })
                        }
                        value={state.keyboard[1]}
                        title={buttonName(
                            buttonToControllerMap,
                            activeController,
                            "B1"
                        )}
                        options={[...keyboardTemplate(), noneOption]}
                    />
                    <Option
                        onChange={(payload) =>
                            dispatch({
                                type: "keyboardB2",
                                payload,
                            })
                        }
                        value={state.keyboard[2]}
                        title={buttonName(
                            buttonToControllerMap,
                            activeController,
                            "B2"
                        )}
                        options={[...keyboardTemplate(), noneOption]}
                    />
                    <Option
                        onChange={(payload) =>
                            dispatch({
                                type: "keyboardB3",
                                payload,
                            })
                        }
                        value={state.keyboard[3]}
                        title={buttonName(
                            buttonToControllerMap,
                            activeController,
                            "B3"
                        )}
                        options={[...keyboardTemplate(), noneOption]}
                    />
                    <Option
                        onChange={(payload) =>
                            dispatch({
                                type: "keyboardB8",
                                payload,
                            })
                        }
                        value={state.keyboard[8]}
                        title={buttonName(
                            buttonToControllerMap,
                            activeController,
                            "B8"
                        )}
                        options={[...keyboardTemplate(), noneOption]}
                    />
                    <Option
                        onChange={(payload) =>
                            dispatch({
                                type: "keyboardB9",
                                payload,
                            })
                        }
                        value={state.keyboard[9]}
                        title={buttonName(
                            buttonToControllerMap,
                            activeController,
                            "B9"
                        )}
                        options={[...keyboardTemplate(), noneOption]}
                    />
                    <Option
                        onChange={(payload) =>
                            dispatch({
                                type: "keyboardB4",
                                payload,
                            })
                        }
                        value={state.keyboard[4]}
                        title={buttonName(
                            buttonToControllerMap,
                            activeController,
                            "B4"
                        )}
                        options={[...keyboardTemplate(), noneOption]}
                    />
                    <Option
                        onChange={(payload) =>
                            dispatch({
                                type: "keyboardB5",
                                payload,
                            })
                        }
                        value={state.keyboard[5]}
                        title={buttonName(
                            buttonToControllerMap,
                            activeController,
                            "B5"
                        )}
                        options={[...keyboardTemplate(), noneOption]}
                    />
                </div>
            </div>
        </Container>
    );
};

export default MappingTab;
