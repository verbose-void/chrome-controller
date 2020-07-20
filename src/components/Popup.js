import React, { useReducer } from "react";
import { Button } from "react-bootstrap";
import { Tab, Tabs } from "react-bootstrap";
import ConfModal from "./ConfModal";
import GeneralTab from "./GeneralTab";
import MappingTab from "./MappingTab";
import { reducer, initialState } from "../reducers/Reducers";
import { consoleLog } from "../utils/debuggingFuncs";

const StarDisplay = () => (
    <div id="rating-container">
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
    </div>
);

const Popup = (props) => {
    const [state, dispatch] = useReducer(reducer, props.currentSettings);

    const { modalIsVisible } = state.popup;
    const toggleModalIsVisible = (payload) =>
        dispatch({
            type: "modalIsVisible",
            payload,
        });

    const onSave = async () => {
        props.updateSettings(state);
        toggleModalIsVisible(false);
    };

    return (
        <div className="popup__container">
            <ConfModal
                onSave={onSave}
                onHide={toggleModalIsVisible}
                show={modalIsVisible}
            />
            <div id="title" className="mainContent__container text-center">
                <h1 className="title-text">SETTINGS</h1>
                <StarDisplay />
                <div className="tabs__container">
                    <Tabs
                        id="generalButtonMappingTabs"
                        defaultActiveKey="general"
                    >
                        <Tab eventKey="general" title="General">
                            <GeneralTab
                                state={state.generalTab}
                                dispatch={dispatch}
                            />
                        </Tab>
                        <Tab eventKey="buttonMapping" title="Button Mapping">
                            <MappingTab
                                state={state.mappingTab}
                                dispatch={dispatch}
                            />
                        </Tab>
                    </Tabs>
                </div>
            </div>
            <div className="confirmButton__container">
                <Button
                    id="saveChangesModalTrigger"
                    variant="dark"
                    onClick={() => toggleModalIsVisible(true)}
                >
                    Save changes
                </Button>
            </div>
        </div>
    );
};

export default Popup;
