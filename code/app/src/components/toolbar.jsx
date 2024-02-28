import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import'../scripts/coloris.js';
import '../scripts/coloris.css';
import { useState, useEffect } from 'react';
import { unselect } from "../scripts/clickEvents";
import { changeColor, changeBgColor, changeLink, changeText, changeFontSize, changeFontWeight, changeFontItalic, changeFontUnderline } from "../scripts/changeStyles.js";
import { save, load, newPage, download, deleteTemplate } from "../scripts/saveLoad.js";
import HomePage from './homepage.jsx';

function Toolbar({ setComponent, setKey, setElements, user }) {
    const template = document.getElementById("Template");
    const [loads, setLoads] = useState([]);
    const [links, setLinks] = useState([]);

    function deleteElement() {
        const id = template.getAttribute("data-selected");
        if (id == null) {
            return;
        }

        if (window.confirm("Are you sure?")) {
            const elem = document.getElementById(id);
            unselect(elem);
            elem.remove();
        }
    }

    useEffect (() => {
        changeText(document.getElementById("Toolbar"));
        changeColor();
        changeBgColor();

        fetch("http://127.0.0.1:8000/api/templates/?owner=" + JSON.parse(user).id) 
        .then(response => response.json())
        .then(data => {
            setLoads(data.reverse());
        })
    }, [user]);

    return (
        <ul id = "Toolbar" className="nav navbar-dark">
            <li className="nav-item">
                <OverlayTrigger overlay={<Tooltip>Text Color</Tooltip>}>
                    <div>
                        <span className="material-symbols-outlined">format_color_text</span>
                        <button id="color-picker" type="text" data-coloris style={{fontSize: "40px", marginRight: "10px"}}>&#9632;</button>
                    </div>     
                </OverlayTrigger>
            </li>
            <li className="nav-item">
                <OverlayTrigger overlay={<Tooltip>Background Color</Tooltip>}>
                    <div>
                        <span className="material-symbols-outlined">format_color_fill</span>
                        <button id="bgcolor-picker" type="text" data-coloris style={{fontSize: "40px"}}>&#9632;</button>
                    </div>
                </OverlayTrigger>
            </li>
            <li>
                <span className="material-symbols-outlined divider">more_vert</span>
            </li>
            <li className="nav-item">
                <OverlayTrigger overlay={<Tooltip>Font Size</Tooltip>}>
                    <div>
                        <DropdownButton
                            as={ButtonGroup}
                            title={<span className="material-symbols-outlined">format_size</span>}
                            size="sm"
                            id="font-size"
                        >
                            {[8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 64, 72, 84, 90, 108].map(
                                (size) => (
                                    <Dropdown.Item 
                                        eventKey={size}
                                        className="w-50"
                                        onClick={() => {changeFontSize(size)}}
                                    >
                                        {size}
                                    </Dropdown.Item>
                                ),
                            )}
                        </DropdownButton>
                    </div>
                </OverlayTrigger>
            </li>
            <li className="nav-item">
                <OverlayTrigger overlay={<Tooltip>Bold</Tooltip>}>
                    <div>
                        <button id="font-weight" onClick={() => {changeFontWeight()}}><span className="material-symbols-outlined">format_bold</span></button>
                    </div>
                </OverlayTrigger>
            </li>
            <li className="nav-item">
                <OverlayTrigger overlay={<Tooltip>Italic</Tooltip>}>
                    <div>
                        <button id="font-italic" onClick={() => {changeFontItalic()}}><span className="material-symbols-outlined">format_italic</span></button>
                    </div>
                </OverlayTrigger>
            </li>
            <li className="nav-item">
                <OverlayTrigger overlay={<Tooltip>Underline</Tooltip>}>
                    <div>
                        <button id="font-underline" onClick={() => {changeFontUnderline()}}><span className="material-symbols-outlined">format_underlined</span></button>
                    </div>
                </OverlayTrigger>
            </li>
            <li className="nav-item">
                <OverlayTrigger overlay={<Tooltip>Link</Tooltip>}>
                    <div>
                        <DropdownButton
                            as={ButtonGroup}
                            title={<span className="material-symbols-outlined">link</span>}
                            id="link-input"
                            onClick={() => {
                                const id = template.getAttribute("data-selected");
                                const elem = document.getElementById(id);
                                if (!elem) { return; }
                                setLinks([...elem.getElementsByTagName("a")]);
                                changeLink(elem);
                            }}
                            autoClose="outside"
                        >
                            {links.map(
                                (link, id) => (
                                    <Dropdown.Item 
                                        eventKey={id}
                                        className="link-inputs"
                                    >
                                        <Form.Group className="mb-3">
                                            <Form.Label column sm="2">{link.innerText}:</Form.Label>
                                            <Form.Control id={"link-input" + id} type="text" size="sm" placeholder="Input link here" />
                                        </Form.Group>
                                    </Dropdown.Item>
                                ),
                            )}
                        </DropdownButton>
                    </div>
                </OverlayTrigger>
            </li>
            <li className="nav-item">
            <span className="material-symbols-outlined divider">more_vert</span>
                <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                    <button onClick={() => deleteElement()}><span className="material-symbols-outlined" style={{color: "#D50000"}}>delete</span></button>
                </OverlayTrigger>
                <span className="material-symbols-outlined divider">more_vert</span>
            </li>
            <li className="nav-item">
                <OverlayTrigger overlay={<Tooltip>Double click to change Template Name</Tooltip>}>
                    <h5 id="template-name" className="writable"> </h5>
                </OverlayTrigger>
            </li>
            <li className="nav-item">
                <OverlayTrigger overlay={<Tooltip>New Template</Tooltip>}>
                    <button className="" onClick={() => {
                        if (window.confirm("Do you want to save the current template?")) {
                            save(user);
                        }
                        newPage(setKey, setElements, user);
                    }}><span className="material-symbols-outlined">note_add</span></button>
                </OverlayTrigger>
            </li>
            <li className="nav-item">
                <OverlayTrigger overlay={<Tooltip>Save</Tooltip>}>
                    <button className="" onClick={() => save(user)}><span className="material-symbols-outlined">save</span></button>
                </OverlayTrigger>
            </li>
            <li className="nav-item">
                <OverlayTrigger overlay={<Tooltip>Load</Tooltip>}>
                    <DropdownButton
                        as={ButtonGroup}
                        title={<span className="material-symbols-outlined">folder_open</span>}
                        id="bg-vertical-dropdown-1"
                        onClick={() => {
                            fetch("http://127.0.0.1:8000/api/templates/?owner=" + JSON.parse(user).id) 
                            .then(response => response.json())
                            .then(data => {
                                setLoads(data.reverse());
                            })}
                        }
                    >
                        {loads.map(
                            (temp) => (
                                <Dropdown.Item 
                                    eventKey={load.id} 
                                    className="load-dropdown"
                                    onClick={() => {
                                        if (window.confirm("Do you want to save any changes to the current template?")) {
                                            save(user);
                                        }
                                        load(temp.id, setElements);
                                        var elems = document.getElementsByClassName("element");
                                        setKey(elems.length);
                                    }}
                                >
                                    {temp.name}
                                </Dropdown.Item>
                            ),
                        )}
                    </DropdownButton>
                </OverlayTrigger>
            </li>
            <li className="nav-item">
                <OverlayTrigger overlay={<Tooltip>Download</Tooltip>}>
                    <button onClick={() => download()}><span className="material-symbols-outlined">download</span></button>
                </OverlayTrigger>
            </li>
            <li className="nav-item">
                <OverlayTrigger overlay={<Tooltip>Delete Template</Tooltip>}>
                    <button onClick={() => {
                        if (window.confirm("Are you sure you want to delete the current template?")) {
                            deleteTemplate();
                            setComponent(<HomePage setComponent={setComponent} user={user}/>)
                        }
                    }}><span className="material-symbols-outlined" style={{color: "#D50000"}}>scan_delete</span></button>
                </OverlayTrigger>
            </li>
        </ul>  
    )
}
export default Toolbar;
