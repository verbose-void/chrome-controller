import React from 'react'
import {Row, Col} from 'react-bootstrap'
import {Slider, SettingSection} from '../GeneralTab'



export const ScrollingSettings = (props) => {
    return (
        <React.Fragment>
            <div className="text-center">
                <h3 className="section-title">SCROLLING</h3>
            </div>
            <Row className="pr-5 pl-5">
                <Col>
                    <SettingSection
                        value={props.state.speed}
                        title="Speed">
                        <Slider 
                            id="scroll-sensitivity"
                            step="1"
                            min="1"
                            max="25"
                            onChange={(value) => props.dispatch({
                                type: "scrollSensitivity",
                                payload: parseInt(value)
                            })}
                            value={props.state.speed}
                        />
                    </SettingSection>
                    <SettingSection
                        value={`${props.state.sprintSpeed}x`}
                        title="Sprint Speed">
                        <Slider 
                            id="scroll-sprint"
                            step="0.1"
                            min="1"
                            max="5"
                            onChange={(value) => props.dispatch({
                                type: "scrollSprint",
                                payload: parseInt(value)
                            })}
                            value={props.state.sprintSpeed}
                        />
                    </SettingSection>
                </Col>
            </Row>
        </React.Fragment>
    )
}
