/* eslint-disable no-undef */
const primaryColors = {
  [Office.HostType.Excel]: "#217346",
  [Office.HostType.PowerPoint]: "#B7472A",
  [Office.HostType.Word]: "#2B579A",
  "Web": "#2B579A"
};

export const rexThemeSpec = (host) => {
  return {
    spacing: 2,
    palette: {
      primary: {
        main: primaryColors[host],
      },
      background: {
        paper: "#f3f2f1"
      }
    },
    shape: {
      borderRadius: 10,
    },
    typography: {
      fontSize: 12,
      button: {
        fontSize: "1rem",
      },
    },
    components: {
      MuiButton: {
        defaultProps: {
          size: "small",
        },
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: "0px",
          },
        },
      },
      MuiFilledInput: {
        defaultProps: {
          margin: "dense",
        },
      },
      MuiFormControl: {
        defaultProps: {
          margin: "dense",
        },
      },
      MuiFormHelperText: {
        defaultProps: {
          margin: "dense",
        },
      },
      MuiIconButton: {
        defaultProps: {
          size: "small",
          padding: 0
        },
      },
      MuiInputBase: {
        defaultProps: {
          margin: "dense",
        },
        styleOverrides: {
          input: {
            paddingBottom: "2px",
            paddingTop: "1px",
            height: "1.2em",
          },
        },
      },
      MuiInputLabel: {
        defaultProps: {
          margin: "dense",
        },
      },
      MuiListItem: {
        defaultProps: {
          dense: true,
        },
      },
      MuiOutlinedInput: {
        defaultProps: {
          margin: "dense",
        },
      },
      MuiFab: {
        defaultProps: {
          size: "small",
        },
      },
      MuiTable: {
        defaultProps: {
          size: "small",
        },
      },
      MuiTextField: {
        defaultProps: {
          margin: "dense",
        },
        styleOverrides: {
          root: {
            display: "flex",
            marginTop: "2px",
          },
        },
      },
      MuiToolbar: {
        defaultProps: {
          variant: "dense",
        },
        styleOverrides: {
          root: {
            borderRadius: "0px",
            height: "38px",
            minHeight: "30px",
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            padding: "5px",
            fontSize: "12px",
            minHeight: "fit-content",
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          scroller: {
            height: "fit-content",
          },
        },
      },
      MuiTableCell: {
        defaultProps: {
          size: "small",
          padding: "none",
        },
        styleOverrides: {
          root: {
            fontSize: "0.65rem",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "0px",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: "0px",
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            paddingTop: "4px",
            paddingBottom: "4px",
            paddingLeft: "8px",
            paddingRight: "8px",
          },
        },
      },
      MuiCardActions: {
        styleOverrides: {
          root: {
            padding: 0,
            paddingLeft: "8px",
            paddingBottom: "4px",
          },
        },
      },
    },
  };
};
