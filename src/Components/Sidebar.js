import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp, getFirestore, getDocs } from "firebase/firestore";
import { storage } from '../firebase.js';
import styled from 'styled-components';
import { Modal } from '@mui/base/Modal';
import MobileScreenShareIcon from '@mui/icons-material/MobileScreenShare';
import DevicesIcon from '@mui/icons-material/Devices';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilder';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorder';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutline';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';

const SidebarContainer = styled.div`
    margin-top: 10px;
`
const SidebarBtn = styled.div`
    button {
        background: transparent;
        border: 1px solid lightgray;
        display: flex;
        align-items: center;
        border-radius: 40px;
        padding:5px 10px;
        box-shadow:2px 2px 2px #ccc;
        margin-left: 20px;
        span {
            font-size: 16px;
            margin-right: 20px;
            margin-left: 10px;
        }
    }
`

const SidebarOptions = styled.div`
    margin-top: 10px;
    .progress_bar {
        padding: 0px 20px;
    }
    .progress_bar span {
        display: block;
        color:#333;
        font-size: 13px;
    }
`

const SidebarOption = styled.div`
    display: flex;
    align-items: center;
    padding: 8px 20px;
    border-radius: 0px 20px 20px 0px;
    &:hover{
        background: whitesmoke;
        cursor: pointer;
    }
    svg.MuiSvgIcon-root {
        color:rgb(78, 78, 78);
    }
    span {
        margin-left: 15px;
        font-size: 13px;
        font-weight: 500;
        color:rgb(78, 78, 78)
    }
`

const ModalPopup = styled.div`
    top: 50%;
    background-color: #fff;
    width: 500px;
    margin: 0px auto;
    position: relative;
    transform: translateY(-50%);
    padding: 10px;
    border-radius: 10px;
`

const ModalHeading = styled.div`
    text-align: center;
    border-bottom: 1px solid lightgray;
    height: 40px;
`

const ModalBody = styled.div`
    input.modal__submit {
        width: 100%;
        background: darkmagenta;
        padding: 10px 20px;
        color: #fff;
        text-transform: uppercase;
        letter-spacing: 5px;
        font-size: 16px;
        border: 0;
        outline: 0;
        border-radius: 5px;
        cursor: pointer;
        margin-top:20px
    }
    input.modal__file {
        background: whitesmoke;
        padding: 20px;
        color: #000;
        display: block;
        margin-top:20px
    }
`

const UploadingPara = styled.p`
    background: green;
    color: #fff;
    margin: 20px;
    text-align: center;
    padding: 10px;
    letter-spacing: 1px;
`

const Sidebar = ({ handleFilesUpdate }) => {
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);

    const handleFile = e => {
        if (e.target.files[0]) {
            console.log("File selected:", e.target.files[0]);
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async e => {
        e.preventDefault();
        setUploading(true);
        console.log("Uploading file:", file);

        try {
            const storageRef = ref(storage, `files/${file.name}`);
            console.log("Storage reference:", storageRef);
            await uploadBytes(storageRef, file);
            console.log("File uploaded successfully");

            const url = await getDownloadURL(storageRef);
            console.log("Download URL:", url);
            const db = getFirestore();
            const collectionRef = collection(db, 'myfiles');

            await addDoc(collectionRef, {
                timestamp: serverTimestamp(),
                filename: file.name,
                fileURL: url,
                size: file.size
            });

            setUploading(false);
            setFile(null);
            setOpen(false);

            // Fetch updated list of files after upload
            const querySnapshot = await getDocs(collectionRef);
            const updatedFiles = querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            }));
            handleFilesUpdate(updatedFiles);
        } catch (error) {
            console.error("Error uploading file:", error);
            setUploading(false);
            // Handle error state or display an error message to the user
        }
    };

    return (
        <>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalPopup>
                    <form onSubmit={handleUpload}>
                        <ModalHeading>
                            <h3>Select file you want to upload</h3>
                        </ModalHeading>
                        <ModalBody>
                            {uploading ? <UploadingPara>Uploading...</UploadingPara> : (
                                <>
                                    <input type="file" className='modal__file' onChange={handleFile} />
                                    <input type="submit" className='modal__submit' />
                                </>
                            )}
                        </ModalBody>
                    </form>
                </ModalPopup>
            </Modal>
            <SidebarContainer>
                <SidebarBtn>
                    <button onClick={() => setOpen(true)}>
                        <img alt='pic' src="data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2236%22 height=%2236%22 viewBox=%220 0 36 36%22%3E%3Cpath fill=%22%2334A853%22 d=%22M16 16v14h4V20z%22/%3E%3Cpath fill=%22%234285F4%22 d=%22M30 16H20l-4 4h14z%22/%3E%3Cpath fill=%22%23FBBC05%22 d=%22M6 16v4h10l4-4z%22/%3E%3Cpath fill=%22%23EA4335%22 d=%22M20 16V6h-4v14z%22/%3E%3Cpath fill=%22none%22 d=%22M0 0h36v36H0z%22/%3E%3C/svg%3E" />
                        <span>New</span>
                    </button>
                </SidebarBtn>
                <SidebarOptions>
                    <SidebarOption>
                        <MobileScreenShareIcon />
                        <span>My Drive</span>
                    </SidebarOption>
                    <SidebarOption>
                        <DevicesIcon />
                        <span>Computers</span>
                    </SidebarOption>
                    <SidebarOption>
                        <PeopleAltOutlinedIcon />
                        <span>Shared with me</span>
                    </SidebarOption>
                    <SidebarOption>
                        <QueryBuilderOutlinedIcon />
                        <span>Recent</span>
                    </SidebarOption>
                    <SidebarOption>
                        <StarBorderOutlinedIcon />
                        <span>Starred</span>
                    </SidebarOption>
                    <SidebarOption>
                        <DeleteOutlineOutlinedIcon />
                        <span>Trash</span>
                    </SidebarOption>
                </SidebarOptions>
                <hr />
                <SidebarOptions>
                    <SidebarOption>
                        <CloudQueueIcon />
                        <span>Storage</span>
                    </SidebarOption>
                    <div className="progress_bar">
                        <progress size="tiny" value="50" max="100" />
                        <span>105 GB  of 200 GB used</span>
                    </div>
                </SidebarOptions>
            </SidebarContainer>
        </>
    )
}
export default Sidebar;
