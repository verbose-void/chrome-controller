import React from 'react'
import {Row, Col, Form} from 'react-bootstrap'
import {Slider, ColorPicker, SettingSection} from '../GeneralTab'

export const HUDSettings = (props) => {
    const {state, dispatch} = props
    return (
        <React.Fragment>
            <div className="text-center">
                <h3 className="section-title">HUD</h3>
            </div>
            <Row className="pr-5 pl-5">
                <Col>
                    <Form.Check style={{marginBottom: "10px"}}>
                        <input
                            defaultChecked={ state.hidden }
                            className="form-check-input setting-modifier form-check-label"
                            type="checkbox"
                            id="hud-hidden"
                            onClick={()=>dispatch({
                                type: "hudHidden",
                                payload: !state.hidden
                            })}
                        />
                        <label className="setting-label mb-2">Hidden</label>
                    </Form.Check>
                    <Form.Check style={{marginBottom: "10px"}}>
                        <input
                            defaultChecked={ state.hideText }
                            className="form-check-input setting-modifier"
                            type="checkbox"
                            id="hud-hide-text"
                            onClick={()=>dispatch({
                                type: "hudHideText",
                                value: !state.hideText
                            })}
                        />
                        <label className="setting-label mb-2">Hide Text</label>
                    </Form.Check>

                    <SettingSection title="Color">                        
                        <ColorPicker
                            value={state.color}
                            id="hud-color"
                            onChange={(value)=>dispatch({
                                type: "hudColor",
                                payload: value
                            })}
                        />
                    </SettingSection>
                    
                    <SettingSection title="Size" value={`${state.size} pixels`}>
                        <Slider 
                            id="hud-size"
                            step="4"
                            min="32"
                            max="128"
                            value={state.size}
                            onChange={value=>dispatch({
                                type: "hudSize",
                                payload: value
                            })}
                        />
                    </SettingSection>
                    <SettingSection title="Position">
                        <select
                            onChange={e=>props.dispatch({
                                type: "hudPosition",
                                payload: e.currentTarget.value
                            })}
                            defaultValue={state.position}
                            className="custom-select setting-modifier"
                            id="hud-position">
                            <option value="top">TOP</option>
                            <option value="left">LEFT</option>
                            <option value="right">RIGHT</option>
                            <option value="bottom">BOTTOM</option>
                        </select>
                    </SettingSection>
                </Col>
            </Row>
        </React.Fragment>
    )
}
