import { useEffect, useState, useCallback } from 'react'
import './App.css'
import Terminal from './components/Terminal'
import FileTree from './components/tree';
import socket from './socket';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
function App() {

  const [fileTree, setFileTree] = useState({})
  const [selectedFilePath, setSelectedFilePath] = useState("");
  const [code, setCode] = useState("");
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [isSaved, setifSaved] = useState(selectedFileContent === code);

  const getFileTree = async () =>{
    const response = await fetch("http://localhost:9000/files")
    const result = await response.json();
    setFileTree(result.tree);
    
  }

  const getFileContents =useCallback(async() =>{
    if(!selectedFilePath)return;
    const response = await fetch(`http://localhost:9000/files/content?path=${selectedFilePath}`);
    const result = await response.json();
    setSelectedFileContent(result.content);
  }, [selectedFilePath]);
  
  useEffect(()=>{
    getFileTree()
  }, []);

  useEffect(()=>{
    socket.on('file:refresh', getFileTree);
    return ()=>{
      socket.off('file:refresh', getFileTree);
    };
  }, []);

  useEffect(()=>{setifSaved(code === selectedFileContent)}, [code, selectedFileContent])

  useEffect(() => {
    setCode("");
    console.log("changed");
  }, [selectedFilePath]);

  useEffect(() => {
    if (selectedFilePath) getFileContents();
  }, [ getFileContents, selectedFilePath]);

  useEffect(()=>{
    if(selectedFilePath && selectedFileContent){
      setCode(selectedFileContent);
    }
  }, [selectedFilePath, selectedFileContent]);

  useEffect(()=>{
    if(code && !isSaved) {
      const timer = setTimeout(()=>{
        socket.emit('file:changed', {
          path: selectedFilePath,
          content: code
        });
      }, 5*1000);

    return () => {
      clearTimeout(timer);
    }
    }
  }, [code])
  return (
    
    <>
    <div className='playground-container'>
    <div className='editor-container'>
      <div className='files'>
        <FileTree tree={fileTree} onSelect={(path) =>{setSelectedFilePath(path)}}/>
      </div>
      <div className='editor'>
        {selectedFilePath && <p>{selectedFilePath.replaceAll('/', ' > ')}{isSaved ? ' Saved' : ' to save'}</p>}
        <AceEditor value={code} onChange={(e) => setCode(e)}/>
      </div>
    </div>

    <div className='terminal-container'>
    <Terminal />
    </div>
    </div>
    </>
  )
}

export default App
