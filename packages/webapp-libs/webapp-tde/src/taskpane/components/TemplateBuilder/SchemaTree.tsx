import React, { useState } from "react";
import { Box, SvgIcon, SvgIconProps, Typography, alpha, styled, TextField, Button, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import { TreeView } from "@mui/lab";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import { PlaceholderType, setCurrentSelection } from "../../../stateManagement/placeholdersSlice";

interface ISchemaTreeProps {
  schemaDetails: {
    schemaId: String;
    schemaName: String;
    schemaSource: { type: number; uri: String };
    schemaTree: Object;
  };
}

function MinusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props: SvgIconProps) {
  return (
    <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

type StyledTreeItemProps = TreeItemProps & {
  labelText: String;
  withAdd?: Boolean;
  handleAdd?: () => void;
};

function StyledTreeItem(props: StyledTreeItemProps) {
  const { labelText, withAdd, handleAdd, ...other } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 0.5,
            pr: 0,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "inherit", flexGrow: 1 }}>
            {labelText}
          </Typography>
          {withAdd && (
            <IconButton size="small" onClick={handleAdd}>
              <AddIcon />
            </IconButton>
          )}
        </Box>
      }
      {...other}
    />
  );
}

const StyledTreeItemRoot = styled((props: TreeItemProps) => <TreeItem {...props} />)(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    "& .close": {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

const SchemaTree: React.FC<ISchemaTreeProps> = ({ schemaDetails }) => {
  const dispatch = useDispatch();
  const [formula, setFormula] = useState<string>("");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [formulas, setFormulas] = useState<{ [key: string]: PlaceholderType }>({});

  const handleClick = (jsonPath, dataType: String, placeholderType: String) => {
    console.log(jsonPath, dataType, placeholderType);
    dispatch(
      setCurrentSelection({
        placeholderName: jsonPath,
        jsonPath,
        dataType,
        placeholderType,
        format: "",
        toType: "",
      })
    );
  };

  const handleAddFormula = () => {
    const formulaKey = `formula-${uuidv4()}`;
    const newPlaceholder = {
      placeholderName: formulaKey,
      jsonPath: "formula",
      dataType: "formula",
      placeholderType: "Formula",
      format: "",
      toType: "",
    };
    dispatch(setCurrentSelection(newPlaceholder));
    setFormulas({ ...formulas, [formulaKey]: newPlaceholder });
  };

  function renderTree(jsonNode, isRoot, jsonPath): React.ReactNode {
    if (isRoot) {
      jsonPath = "$";
      return (
        <StyledTreeItem nodeId={jsonPath} labelText={jsonNode.title}>
          {renderTree(jsonNode.properties, false, jsonPath)}
        </StyledTreeItem>
      );
    }
    return Object.entries(jsonNode).map(([k, v]) => {
      if (v["type"] === "object") {
        let localJsonPath = jsonPath + "." + k;
        return (
          <StyledTreeItem key={localJsonPath} nodeId={localJsonPath} labelText={k}>
            {renderTree(v["properties"], false, localJsonPath)}
          </StyledTreeItem>
        );
      } else if (v["type"] === "array") {
        let localJsonPath = jsonPath + "." + k + "[*]";
        return v["items"].type === "object" ? (
          <StyledTreeItem key={localJsonPath} nodeId={localJsonPath} labelText={k + "[*]"}>
            {renderTree(v["items"].properties, false, localJsonPath)}
          </StyledTreeItem>
        ) : (
          <StyledTreeItem
            key={localJsonPath}
            nodeId={localJsonPath}
            labelText={k + "[*]"}
            onClick={() => {
              handleClick(localJsonPath, v["items"].type, "Column");
              setSelectedNode(localJsonPath);
            }}
          />
        );
      } else {
        let localJsonPath = jsonPath + "." + k;
        let isArray = jsonPath.includes("[*]");
        return (
          <StyledTreeItem
            key={localJsonPath}
            nodeId={localJsonPath}
            labelText={k}
            onClick={() => {
              handleClick(localJsonPath, v["type"], isArray ? "Column" : "Single Value");
              setSelectedNode(localJsonPath);
            }}
          />
        );
      }
    });
  }

  return schemaDetails == null ? (
    <>
      <Typography variant="h6" sx={{ opacity: 0.5, position: "relative", top: "35%" }}>
        Looks like there is no schema binding.
        <br />
        Please add schema binding!!
      </Typography>
    </>
  ) : (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <TreeView
          aria-label="customized"
          defaultExpanded={["2"]}
          defaultCollapseIcon={<MinusSquare />}
          defaultExpandIcon={<PlusSquare />}
          defaultEndIcon={<CloseSquare />}
          sx={{ height: "100%", flexGrow: 1, overflowY: "auto", overflowX: 'hidden' }}
        >
          {false && <StyledTreeItem nodeId="formulas" labelText="Formulas" withAdd handleAdd={()=>handleAddFormula()}>
            {Object.entries(formulas).map(([key, value]) => (
              <StyledTreeItem key={key} nodeId={key} labelText={value.placeholderName} onClick={() => {
                handleClick("", "Formula", "Column");
                setSelectedNode("");
              }}/>
            ))}
          </StyledTreeItem>}
          {renderTree(schemaDetails.schemaTree, true, "")}
        </TreeView>
      </Box>
    </>
  );
};

export default SchemaTree;
