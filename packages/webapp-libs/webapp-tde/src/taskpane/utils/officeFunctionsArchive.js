convertXmlToJsonArray(rexXml: string) {
    var matches = rexXml.matchAll(/<Placeholder>(.*?)<\/Placeholder>/gms);
    return Array.from(matches).map((m) => {
      var innerM = m[1].matchAll(/<([^>]+)>([^<]+)<\/\1>/gms);
      var res = {};
      Array.from(innerM).forEach((im) => {
        var [, tagName, tagValue] = im;
        res[tagName] = tagValue;
      });
      return res;
    });
  }

  createSchemaBinding(oldXml: string, schemaId: string) {
    var updatedXml = oldXml;
    const rexSchemaBindingExists = /<RexSchemaBinding>.*?<\/RexSchemaBinding>/s.test(oldXml);

    if (!rexSchemaBindingExists) {
      updatedXml = oldXml.replace(
        /<\/RexTemplate>/s,
        `<RexSchemaBinding>
          <SchemaId>${schemaId}</SchemaId>
          <Placeholders>
          </Placeholders>
        </RexSchemaBinding></RexTemplate>`
      );
    } else {
      updatedXml = oldXml.replace(
        /<RexSchemaBinding>.*?<\/RexSchemaBinding>/s,
        `<RexSchemaBinding>
          <SchemaId>${schemaId}</SchemaId>
          <Placeholders>
          </Placeholders>
        </RexSchemaBinding>`
      );
    }
    return updatedXml;
  }

  deleteSchemaBinding(oldXml: string) {
    var updatedXml = oldXml;
    const rexSchemaBindingExists = /<RexSchemaBinding>.*?<\/RexSchemaBinding>/s.test(oldXml);

    if (rexSchemaBindingExists) {
      updatedXml = oldXml.replace(/<RexSchemaBinding>.*?<\/RexSchemaBinding>/s, "");
    } else {
      console.log("schema binding doesnt exist");
    }
    return updatedXml;
  }

  addPlaceHoldersToXml(oldXml: string, placeholders: PlaceholderType[]) {
    var updatedXml = oldXml;

    const placeholdersXml = placeholders.map((ph) => {
      let xml = "<Placeholder>";
      Object.entries(ph).forEach(([key, value]) => {
        xml += `<${key}>${value}</${key}>`;
      });
      xml += "</Placeholder>";
      return xml;
    });
    const rexSchemaBindingExists =
      /<RexSchemaBinding>.*?<Placeholders>.*?<\/Placeholders>.*?<\/RexSchemaBinding>/s.test(oldXml);

    if (rexSchemaBindingExists) {
      updatedXml = oldXml.replace(/<\/Placeholders>/s, `${placeholdersXml}</Placeholders>`);
    } else {
      console.error("Cannot add placeholders as no schema bimnnding is present");
    }
    return updatedXml;
  }

  async copyTextToClipboard(placeholderName) {
    try {
      await navigator.clipboard.writeText("<" + placeholderName + ">");
    } catch (error) {
      console.error(error);
    }
  }

  async addTextInTemplate(placeholderName: string): Promise<void> {
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
  async createRexTemplateCustomXml(templateId: String) {
    try {
      await Excel.run(async (context) => {
        const settings = context.workbook.settings;
        const xmlPartIDSetting = settings.getItemOrNullObject("RexTemplateXmlPartId").load("value");
        await context.sync();

        if (!xmlPartIDSetting.value) {
          const originalXml = `<RexTemplate xmlns='http://schemas.rex.com/template/1.0'>
              <TemplateId>${templateId}</TemplateId>
            </RexTemplate>`;
          const customXmlPart = context.workbook.customXmlParts.add(originalXml);
          customXmlPart.load("id");

          await context.sync();

          settings.add("RexTemplateXmlPartId", customXmlPart.id);

          await context.sync();
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getAllPlaceHolders() {
    try {
      var result = [];
      await Excel.run(async (context) => {
        const settings = context.workbook.settings;
        const xmlPartIDSetting = settings.getItemOrNullObject("RexTemplateXmlPartId").load("value");
        await context.sync();

        if (xmlPartIDSetting.value) {
          const customXmlPart = context.workbook.customXmlParts.getItem(xmlPartIDSetting.value);
          const rexXml = customXmlPart.getXml();
          await context.sync();

          const rexSchemaBindingExists =
            // eslint-disable-next-line office-addins/load-object-before-read
            /<RexSchemaBinding>.*?<Placeholders>.*?<\/Placeholders>.*?<\/RexSchemaBinding>/s.test(rexXml.value);

          // eslint-disable-next-line office-addins/load-object-before-read
          if (rexSchemaBindingExists) result = super.convertXmlToJsonArray(rexXml.value);
        }
      });
      return Promise.resolve(result);
    } catch (error) {
      console.error(error);
    }
    return Promise.resolve([]);
  }

  async processRexSchemaBindingCustomXml(processXml: (oldXml: string, ...args: any[]) => string, ...args: any[]) {
    try {
      await Excel.run(async (context) => {
        const settings = context.workbook.settings;
        const xmlPartIDSetting = settings.getItemOrNullObject("RexTemplateXmlPartId").load("value");
        await context.sync();

        if (xmlPartIDSetting.value) {
          const customXmlPart = context.workbook.customXmlParts.getItem(xmlPartIDSetting.value);
          const rexXml = customXmlPart.getXml();
          await context.sync();
          // eslint-disable-next-line office-addins/load-object-before-read
          var precessedXml = processXml(rexXml.value, ...args);

          customXmlPart.setXml(precessedXml);

          await context.sync();
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  async updatePlaceholderReference(placeholderName) {
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

  async getPlaceholderReference(placeholderName) {
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