const FileTreeNode = ({fileName, nodes, path, onSelect}) =>{
    
    const isdir = !!nodes;
return (
    <div 
    onClick={(e) =>{
        e.stopPropagation();
        if(isdir)return;
        onSelect(path);
    }}
    style={{marginLeft: "10px"}}>
         <p className={isdir ? "" : "file-node"}>{fileName}</p>
       {nodes && (
       <ul>
       {Object.keys(nodes).map(child=>(
           < li key={child}>
                <FileTreeNode fileName={child} nodes={nodes[child]} path={path + '/' + child} onSelect={onSelect} />
            </li>
        ))
        }
       </ul>)
   
    }
    </div>
)} 

const FileTree = ({tree, onSelect}) =>{
  
    return (
        <FileTreeNode fileName="/" nodes={tree} path="" onSelect={onSelect}/>
    )
}

export default FileTree;