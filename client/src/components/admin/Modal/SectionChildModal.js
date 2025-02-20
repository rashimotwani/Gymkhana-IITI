import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { useState } from "react";
import { uploadImageServer } from "../../../redux/actions/contentVersions"
import { useDispatch } from "react-redux";
import "../Form/Form.css"
import TextField from "@material-ui/core/TextField";
import { addSectionChild, updateSectionChild } from "../../../redux/actions/contentVersions";

export default function SectionChildModal({ userName, sectionID, sectionChildID, sectionChild, type, triggerElement }) {

    const [fileInputState, setFileInputState] = useState('');
    const [selectedFile, setSelectedFile] = useState();

    const [formSectionChild, setFormSectionChild] = useState(sectionChild)

    const dispatch = useDispatch();

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setFileInputState(e.target.value);
    };

    const handleEdit = (e) => {
        e.preventDefault();

        if (!selectedFile) {
            submitEdit('imageError')
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
            submitEdit(reader.result);
            return
        };
        reader.onerror = () => {
            submitEdit('imageError')
            return
        };

        submitEdit('imageError')
    };

    const submitEdit = async (base64EncodedImage) => {
        try {
            dispatch(updateSectionChild(userName, sectionID, sectionChildID, formSectionChild))

            if (base64EncodedImage !== 'imageError') {
                dispatch(uploadImageServer({
                    method: 'POST',
                    img: JSON.stringify({ data: base64EncodedImage }),
                    userName: userName,
                    dataFor: type,
                    sectionID: sectionID,
                    sectionChildID: sectionChildID,
                    headers: { 'Content-Type': 'application/json' }
                }))
            }

            setFileInputState('');
            setOpen(false)
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdd = () => {
        console.log("Handling Add")
        console.log(formSectionChild)
        dispatch(addSectionChild(userName, sectionID, formSectionChild));
        setFileInputState('');
        setOpen(false);
    }




    function getModalStyle() {
        const top = 50
        const left = 50
        return {
            top: `${top}%`,
            left: `${left}%`,
            transform: `translate(-${top}%, -${left}%)`,
        };
    }

    const useStyles = makeStyles(theme => ({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        paper: {
            position: 'absolute',
            width: 450,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }));

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };



    return (
        <div>
            <div onClick={handleOpen}>
                {triggerElement}
            </div>

            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={handleClose}
            >
                <div style={modalStyle} className={classes.paper}>
                    <form id="form">
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="section-child-name"
                            label="Section Child Name"
                            type="text"
                            name="section-child-name"
                            autoComplete="Section Child Name"
                            className="field"
                            value={formSectionChild.sectionChildName}
                            onChange={(e) => setFormSectionChild({ ...formSectionChild, sectionChildName: e.target.value })}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            minRows={3}
                            id="section-child-short-desc"
                            label="Section Child Short Description"
                            type="text"
                            name="section-child-short-desc"
                            autoComplete="Section Child Short Description"
                            className="field"
                            value={formSectionChild.sectionChildShortDesc}
                            onChange={(e) => setFormSectionChild({ ...formSectionChild, sectionChildShortDesc: e.target.value })}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            minRows={3}
                            id="section-child-desc"
                            label="Section Child Description"
                            type="text"
                            name="section-child-desc"
                            autoComplete="Section Child Description"
                            className="field"
                            value={formSectionChild.sectionChildDesc}
                            onChange={(e) => setFormSectionChild({ ...formSectionChild, sectionChildDesc: e.target.value })}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            minRows={3}
                            id="section-child-links"
                            label="Section Child Links"
                            type="text"
                            name="section-child-links"
                            autoComplete="Section Child Links"
                            className="field"
                            value={formSectionChild.sectionChildLinks}
                            onChange={(e) => setFormSectionChild({ ...formSectionChild, sectionChildLinks: e.target.value.split(',') })}
                        />
                        {
                            type === "editSectionChild" ? <input id="fileInput" type="file" name="image" onChange={handleFileInputChange} value={fileInputState} /> : <></>
                        }
                        <Button type="button" onClick={type === "editSectionChild" ? handleEdit : handleAdd}>Confirm</Button>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
