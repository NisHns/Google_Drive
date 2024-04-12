import { useEffect, useState } from 'react';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import styled from 'styled-components';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ListIcon from '@mui/icons-material/List';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Avatar } from '@mui/material';

const DataContainer = styled.div`
    flex: 1 1;
    padding: 10px 0px 0px 20px;
`;

const DataHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid lightgray;
    height: 40px;
    .headerLeft {
        display: flex;
        align-items: center;
    }
    .headerRight svg {
        margin:0px 10px;
    }
`;

const DataGrid = styled.div`
    display: flex;
    align-items: center;
    margin-top: 30px;
    margin-bottom: 30px;
`;

const DataFile = styled.div`
    text-align: center;
    border: 1px solid rgb(204 204 204 / 46%);
    margin: 10px;
    min-width: 200px;
    padding: 10px 0px 0px 0px;
    border-radius: 5px;
    svg {
        font-size: 60px;
        color:gray;
    }
    p {
        border-top: 1px solid #ccc;
        margin-top: 5px;
        font-size: 12px;
        background: whitesmoke;
        padding: 10px 0px;
    }
`;

const DataListRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
    padding: 10px;
    p {
        display: flex;
        align-items: center;
        font-size: 13px;
        b {
            display: flex;
            align-items: center;
        }
        svg {
            font-size: 22px;
            margin:10px;
        }
    }
`;

const Data = ({ photoURL }) => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const storage = getStorage();
        const listRef = ref(storage, 'files'); // Replace 'files' with your folder name

        listAll(listRef)
            .then(async (res) => {
                const filePromises = res.items.map(async (itemRef) => {
                    const fileUrl = await getDownloadURL(itemRef);
                    return { name: itemRef.name, url: fileUrl };
                });
                const fileList = await Promise.all(filePromises);
                setFiles(fileList);
            }).catch((error) => {
                console.error("Error fetching documents: ", error);
                // Handle error
            });
    }, []);

    return (
        <DataContainer>
            <DataHeader>
                <div className="headerLeft">
                    <p>My Drive</p>
                    <ArrowDropDownIcon />
                </div>
                <div className="headerRight">
                    <ListIcon />
                    <InfoOutlinedIcon />
                </div>
            </DataHeader>
            {files.length > 0 ? (
                <>
                    <DataGrid>
                        {files.map(file => (
                            <DataFile key={file.name}>
                                <InsertDriveFileIcon />
                                <p>{file.name}</p>
                            </DataFile>
                        ))}
                    </DataGrid>
                    <div>
                        <DataListRow>
                            <p><b>Name <ArrowDownwardIcon /></b></p>
                            <p><b>Owner</b></p>
                            <p><b>Last Modified</b></p>
                            <p><b>File Size</b></p>
                        </DataListRow>
                        {files.map(file => (
                            <DataListRow key={file.name}>
                                <a href={file.url} target='_blank' rel="noopener noreferrer">
                                    <p><InsertDriveFileIcon /> {file.name}</p>
                                </a>
                                <p><Avatar src={photoURL} />Me </p>
                                <p>{new Date().toUTCString()}</p>
                                {/* Assuming timestamp and size properties are not available in the file object */}
                                <p>{1.4}</p>
                            </DataListRow>
                        ))}
                    </div>
                </>
            ) : (
                <p>No files available</p>
            )}
        </DataContainer>
    );
};

export default Data;
