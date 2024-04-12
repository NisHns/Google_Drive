// ParentComponent.js

import { useState } from 'react';
import Sidebar from './Sidebar'; // Adjust the path as needed
import Data from './Data'; // Adjust the path as needed

const ParentComponent = () => {
    const [files, setFiles] = useState([]);

    // Function to update files in Data component
    const handleFilesUpdate = updatedFiles => {
        setFiles(updatedFiles);
    };

    return (
        <>
            <Sidebar handleFilesUpdate={handleFilesUpdate} />
            <Data files={files} />
        </>
    );
}

export default ParentComponent;
