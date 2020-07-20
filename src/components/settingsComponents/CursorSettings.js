import React from "react";
import { Row, Col } from "react-bootstrap";
import { Slider, ColorPicker, SettingSection } from "../GeneralTab";
import { consoleLog } from "../../utils/debuggingFuncs";

export const CursorSettings = (props) => {
    return (
        <React.Fragment>
            <div className="text-center">
                <h3 className="section-title">CURSOR</h3>
            </div>

            <Row className="pr-5 pl-5">
                <Col>
                    <SettingSection title="Color">
                        <ColorPicker
                            id="cursor-color"
                            value={props.state.color}
                            onChange={(value) => {
                                props.dispatch({
                                    type: "cursorColor",
                                    payload: value,
                                });
                            }}
                        />
                    </SettingSection>
                    <SettingSection
                        value={`${props.state.radius} pixels`}
                        title="Radius"
                    >
                        <Slider
                            id="cursor-radius"
                            step="1"
                            min="5"
                            max="30"
                            value={props.state.radius}
                            onChange={(value) =>
                                props.dispatch({
                                    type: "cursorRadius",
                                    payload: parseInt(value),
                                })
                            }
                        />
                    </SettingSection>
                    <SettingSection
                        value={props.state.horizontalSpeed}
                        title="Horizontal Speed"
                    >
                        <Slider
                            id="horizontal-cursor-sensitivity"
                            step="0.1"
                            min="1"
                            max="12"
                            value={props.state.horizontalSpeed}
                            onChange={(value) =>
                                props.dispatch({
                                    type: "horizontalCursorSpeed",
                                    payload: parseFloat(value),
                                })
                            }
                        />
                    </SettingSection>
                    <SettingSection
                        value={props.state.verticalSpeed}
                        title="Vertical Speed"
                    >
                        <Slider
                            id="vertical-cursor-sensitivity"
                            step="0.1"
                            min="1"
                            max="12"
                            value={props.state.verticalSpeed}
                            onChange={(value) =>
                                props.dispatch({
                                    type: "verticalCursorSpeed",
                                    payload: parseFloat(value),
                                })
                            }
                        />
                    </SettingSection>
                    <SettingSection
                        value={`${(props.state.idleHideTimer / 1000).toFixed(
                            2
                        )} seconds`}
                        title="Idle Hide Timer"
                    >
                        <Slider
                            id="idle-cursor-timer"
                            step="0.1"
                            min="1000"
                            max="15000"
                            value={props.state.idleHideTimer}
                            onChange={(value) =>
                                props.dispatch({
                                    type: "idleHideTimer",
                                    payload: parseFloat(value),
                                })
                            }
                        />
                    </SettingSection>
                </Col>
            </Row>
        </React.Fragment>
    );
};
