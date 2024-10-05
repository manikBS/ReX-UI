 
import { PlaceholderType } from "../../stateManagement/placeholdersSlice";
import { ISchemaDetails } from "../components/TemplateBuilder";

interface ISchemaDetailsSettings extends ISchemaDetails {
  placeholders?: PlaceholderType[];
}

abstract class OfficeInteropManager {
  abstract stampRexTemplateId(templateId: string): void;
  abstract stampRexSchemaId(schemaId: string): void;
  abstract addTextInTemplate(placeholderName: string): void;

  createRexTemplateSetting(templateId: string): string {
    try {
      this.stampRexTemplateId(templateId);
      const rexTemplateSetting = Office.context.document.settings.get("RexTemplate");
      if (!rexTemplateSetting) {
        Office.context.document.settings.set("RexTemplate", { rexTemplateId: templateId });

        Office.context.document.settings.saveAsync(function (asyncResult) {
          console.log("Settings saved with status: " + asyncResult.status);
        });
        return templateId;
      }

      console.log("Rex Template settings is already created: ", rexTemplateSetting["rexTemplateId"]);
      return rexTemplateSetting["rexTemplateId"];
    } catch (error) {
      console.error(error);
    }
    return "";
  }

  createRexSchemaBinding(schemaDatails: ISchemaDetailsSettings) {
    try {
      this.stampRexSchemaId(schemaDatails.schemaId);
      const rexTemplateSetting = Office.context.document.settings.get("RexTemplate");
      if (rexTemplateSetting) {
        let rsb = {
          schemaId: schemaDatails.schemaId,
          schemaName: schemaDatails.schemaName,
          schemaTree: schemaDatails.schemaTree,
          schemaSource: schemaDatails.schemaSource,
          placeholders: [],
        };
        rexTemplateSetting["rexSchemaBinding"] = rsb;

        Office.context.document.settings.set("RexTemplate", rexTemplateSetting);

        Office.context.document.settings.saveAsync(function (asyncResult) {
          console.log("Settings saved with status: " + asyncResult.status);
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  deleteRexSchemaBinding() {
    try {
      this.stampRexSchemaId(null);
      const rexTemplateSetting = Office.context.document.settings.get("RexTemplate");
      if (rexTemplateSetting) {
        delete rexTemplateSetting["rexSchemaBinding"];

        Office.context.document.settings.set("RexTemplate", rexTemplateSetting);

        Office.context.document.settings.saveAsync(function (asyncResult) {
          console.log("Settings saved with status: " + asyncResult.status);
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  addPlaceholdersToSchemaBinding(placeholders: PlaceholderType[]) {
    try {
      const rexTemplateSetting = Office.context.document.settings.get("RexTemplate");
      if (rexTemplateSetting) {
        const pls = rexTemplateSetting["rexSchemaBinding"]["placeholders"];
        rexTemplateSetting["rexSchemaBinding"]["placeholders"] = pls.concat(placeholders);

        Office.context.document.settings.set("RexTemplate", rexTemplateSetting);

        Office.context.document.settings.saveAsync(function (asyncResult) {
          console.log("Settings saved with status: " + asyncResult.status);
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  getSchemaDetailsFromSettings(): ISchemaDetailsSettings {
    try {
      const rexTemplateSetting = Office.context.document.settings.get("RexTemplate");
      if (rexTemplateSetting) {
        return rexTemplateSetting["rexSchemaBinding"];
      }
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async copyTextToClipboard(placeholderName) {
    try {
      await navigator.clipboard.writeText("<" + placeholderName + ">");
    } catch (error) {
      console.error(error);
    }
  }
}

class DocumentInteropManager extends OfficeInteropManager {
  async stampRexTemplateId(templateId: string) {
    await Word.run(async (context) => {
      const document = context.document;
      const customProperties = document.properties.customProperties;

      customProperties.add("RexTemplateId", templateId);

      await context.sync();
    });
  }
  async stampRexSchemaId(schemaId: string) {
    await Word.run(async (context) => {
      const document = context.document;
      const customProperties = document.properties.customProperties;

      customProperties.add("RexSchemaId", schemaId);

      await context.sync();
    });
  }
  async addTextInTemplate(placeholderName: String) {
    Word.run(async (context) => {
      var document = context.document;
      var range = document.getSelection();

      range.insertText("<" + placeholderName + ">", Word.InsertLocation.replace);

      return context.sync();
    }).catch((error) => {
      console.error(error);
    });
  }
}

class WorkbookInteropManager extends OfficeInteropManager {
  async stampRexTemplateId(templateId: string) {
    await Excel.run(async (context) => {
      const sheet = context.workbook.worksheets.getActiveWorksheet();
      await context.sync();
      const customProperties = sheet.customProperties;

      customProperties.add("RexTemplateId", templateId);

      await context.sync();
    });
  }
  async stampRexSchemaId(schemaId: string) {
    await Excel.run(async (context) => {
      const sheet = context.workbook.worksheets.getActiveWorksheet();
      await context.sync();
      const customProperties = sheet.customProperties;

      customProperties.add("RexSchemaId", schemaId);

      await context.sync();
    });
  }
  async addTextInTemplate(placeholderName: String): Promise<void> {
    try {
      await Excel.run(async (context) => {
        const activeCell = context.workbook.getActiveCell();
        activeCell.values = [["<" + placeholderName + ">"]];

        await context.sync();
      });
    } catch (error) {
      console.error(error);
    }
  }
}

class PresentationInteropManager extends OfficeInteropManager {
  async stampRexTemplateId(templateId: string) {
    await PowerPoint.run(async (context) => {
      const customProperties = context.presentation.tags;
      customProperties.add("RexTemplateId", templateId);

      await context.sync();
    });
  }
  async stampRexSchemaId(schemaId: string) {
    await PowerPoint.run(async (context) => {
      const customProperties = context.presentation.tags;
      customProperties.add("RexSchemaId", schemaId);

      await context.sync();
    });
  }
  async addTextInTemplate(placeholderName: String) {
    Office.context.document.setSelectedDataAsync("<" + placeholderName + ">", (asyncResult) => {
      if (asyncResult.status === Office.AsyncResultStatus.Failed) {
        console.error(asyncResult.error.message);
      }
    });
  }
}

const officeInteropManager = () => {
  const applicationType = Office.context.host;
  switch (applicationType) {
    case Office.HostType.Word:
      return new DocumentInteropManager();
    case Office.HostType.Excel:
      return new WorkbookInteropManager();
    case Office.HostType.PowerPoint:
      return new PresentationInteropManager();
    default:
      console.error("Unsupported Office application");
      throw new Error("Unsupported Office application");
  }
};

export default officeInteropManager;
