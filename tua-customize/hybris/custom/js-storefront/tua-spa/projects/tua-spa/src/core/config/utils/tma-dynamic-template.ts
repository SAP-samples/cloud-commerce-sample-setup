// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

export class TmaDynamicTemplate {
  static resolve(templateString: string, templateVariables: any) {
    for (const variableLabel of Object.keys(templateVariables)) {
      const placeholder = new RegExp('\\${' + variableLabel + '}', 'g');
      templateString = templateString.replace(
        placeholder,
        templateVariables[variableLabel]
      );
    }
    return templateString;
  }
}
