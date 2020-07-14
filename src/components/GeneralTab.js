import React from "react";
import { Form } from "react-bootstrap";
import { ScrollingSettings } from "./settingsComponents/ScrollingSettings";
import { CursorSettings } from "./settingsComponents/CursorSettings";
import { HUDSettings } from "./settingsComponents/HUDSettings";

export const Slider = (props) => {
    return (
        <input
            type="range"
            className={`slider setting-modifier ${
                props.className ? props.className : ""
            }`}
            id={props.id}
            step={props.step}
            min={props.min}
            max={props.max}
            onChange={(e) => {
                props.onChange(e.currentTarget.value);
            }}
            defaultValue={props.value}
        />
    );
};

export const ColorPicker = (props) => {
    return (
        <input
            type="color"
            defaultValue={props.value}
            id={props.id}
            className="color-picker setting-modifier"
            onChange={(e) => props.onChange(e.currentTarget.value)}
        />
    );
};

export const SettingSection = (props) => {
    return (
        <Form.Group>
            <div>
                <label className="setting-label">{props.title}</label>
            </div>
            <label className="range-display">{props.value}</label>
            {props.children}
        </Form.Group>
    );
};

const GeneralTab = (props) => {
    console.log("generaltab", props.state.cursor);
    return (
        <div id="settings-container" className="page">
            <Form>
                <div className="sec-div" style={{ marginTop: "0px" }}>
                    <ScrollingSettings
                        state={props.state.scrolling}
                        dispatch={props.dispatch}
                    />
                </div>
                <div className="sec-div">
                    <CursorSettings
                        state={props.state.cursor}
                        dispatch={props.dispatch}
                    />
                </div>
                <div className="sec-div" style={{ marginBottom: "0px" }}>
                    <HUDSettings
                        state={props.state.hud}
                        dispatch={props.dispatch}
                    />
                </div>
            </Form>
        </div>
    );
};

export default GeneralTab;
