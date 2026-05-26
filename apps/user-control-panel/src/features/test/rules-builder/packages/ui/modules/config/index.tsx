import React from "react";
import * as Widgets from "../components/widgets";
import * as CustomOperators from "../components/operators";
import { CoreConfig, Utils } from "../../../core/modules";
import * as ColorUtils from "../utils/colorUtils";


//----------------------------  conjunctions

const conjunctions = {
  ...CoreConfig.conjunctions,
};

//----------------------------  operators

const operators = {
  ...CoreConfig.operators,
  proximity: {
    ...CoreConfig.operators.proximity,
    options: {
      ...CoreConfig.operators.proximity.options,
      factory: (props: any, {RCE, O: {ProximityOperator}}: any) => RCE(ProximityOperator, props),
    },
  },
};


//----------------------------  widgets

const widgets = {
  text: {
    ...CoreConfig.widgets.text,
    factory: (props: any, {RCE, W: {VanillaTextWidget}}: any) => RCE(VanillaTextWidget, props),
  },
  textarea: {
    ...CoreConfig.widgets.textarea,
    factory: (props: any, {RCE, W: {VanillaTextAreaWidget}}: any) => RCE(VanillaTextAreaWidget, props),
  },
  number: {
    ...CoreConfig.widgets.number,
    factory: (props: any, {RCE, W: {VanillaNumberWidget}}: any) => RCE(VanillaNumberWidget, props),
  },
  price: {
    ...CoreConfig.widgets.price,
    factory: (props: any, {RCE, W: {VanillaPriceWidget}}: any) => RCE(VanillaPriceWidget, props),
  },
  slider: {
    ...CoreConfig.widgets.slider,
    factory: (props: any, {RCE, W: {VanillaSliderWidget}}: any) => RCE(VanillaSliderWidget, props),
  },
  select: {
    ...CoreConfig.widgets.select,
    factory: (props: any, {RCE, W: {VanillaSelectWidget}}: any) => RCE(VanillaSelectWidget, props),
  },
  multiselect: {
    ...CoreConfig.widgets.multiselect,
    factory: (props: any, {RCE, W: {VanillaMultiSelectWidget}}: any) => RCE(VanillaMultiSelectWidget, props),
  },
  date: {
    ...CoreConfig.widgets.date,
    factory: (props: any, {RCE, W: {VanillaDateWidget}}: any) => RCE(VanillaDateWidget, props),
  },
  time: {
    ...CoreConfig.widgets.time,
    factory: (props: any, {RCE, W: {VanillaTimeWidget}}: any) => RCE(VanillaTimeWidget, props),
  },
  datetime: {
    ...CoreConfig.widgets.datetime,
    factory: (props: any, {RCE, W: {VanillaDateTimeWidget}}: any) => RCE(VanillaDateTimeWidget, props),
  },
  boolean: {
    ...CoreConfig.widgets.boolean,
    factory: (props: any, {RCE, W: {VanillaBooleanWidget}}: any) => RCE(VanillaBooleanWidget, props),
  },
  field: {
    ...CoreConfig.widgets.field,
    factory: (props: any, {RCE, W: {ValueFieldWidget}}: any) => RCE(ValueFieldWidget, props),
    customProps: {
      showSearch: true
    }
  },
  func: {
    ...CoreConfig.widgets.func,
    factory: (props: any, {RCE, W: {FuncWidget}}: any) => RCE(FuncWidget, props),
    customProps: {
      //showSearch: true
    }
  },
  /**
   * @deprecated
   */
  case_value: {
    ...CoreConfig.widgets.case_value,
    // simple text value
    factory: (props: any, {RCE, W: {VanillaTextWidget}}: any) =>  RCE(VanillaTextWidget, props),
  }
};

//----------------------------  types

const types = {
  ...CoreConfig.types,
  select: {
    ...CoreConfig.types.select,
    widgets: {
      ...CoreConfig.types.select.widgets,
      select: {
        ...CoreConfig.types.select.widgets.select,
        widgetProps: {
          customProps: {
            showSearch: true
          }
        },
      }
    }
  }
};

//----------------------------  settings

const settings = {
  ...CoreConfig.settings,

  renderField: (props: any, {RCE, W: {VanillaFieldSelect}}: any) => RCE(VanillaFieldSelect, props),
  renderOperator: (props: any, {RCE, W: {VanillaFieldSelect}}: any) => RCE(VanillaFieldSelect, props),
  renderFunc: (props: any, {RCE, W: {VanillaFieldSelect}}: any) => RCE(VanillaFieldSelect, props),
  renderConjs: (props: any, {RCE, W: {VanillaConjs}}: any) => RCE(VanillaConjs, props),
  renderSwitch: (props: any, {RCE, W: {VanillaSwitch}}: any) => RCE(VanillaSwitch, props),
  renderButton: (props: any, {RCE, W: {VanillaButton}}: any) => RCE(VanillaButton, props),
  renderIcon: (props: any, {RCE, W: {VanillaIcon}}: any) => RCE(VanillaIcon, props),
  renderButtonGroup: (props: any, {RCE, W: {VanillaButtonGroup}}: any) => RCE(VanillaButtonGroup, props),
  renderProvider: (props: any, {RCE, W: {VanillaProvider}}: any) => RCE(VanillaProvider, props),
  renderValueSources: (props: any, {RCE, W: {VanillaValueSources}}: any) => RCE(VanillaValueSources, props),
  renderConfirm: (props: any, {W: {vanillaConfirm}}: any) => vanillaConfirm(props),
  renderSwitchPrefix: "IF",
  renderBeforeCaseValue: (props: any, {RCE}: any) => RCE("span", {children: [" then "]}),

  customFieldSelectProps: {
    showSearch: true
  },
  customOperatorSelectProps: {
    // showSearch: false
  },

  //theme
  designSettings: {
    canInheritThemeFromOuterProvider: true,
    useThickLeftBorderOnHoverItem: false,
    useShadowOnHoverItem: false,
    generateCssVarsFromThemeLibrary: true, // false to use design like in < 6.7
  },
  themeMode: undefined,
  liteMode: true,
  compactMode: false,
  renderSize: "small",
  defaultSliderWidth: "200px",
  defaultSelectWidth: "200px",
  defaultSearchWidth: "100px",
  defaultMaxRows: 5,
  maxLabelsLength: 100,

  showLock: false,
  showNot: true,
  forceShowConj: false,
  groupActionsPosition: "topRight", // oneOf [topLeft, topCenter, topRight, bottomLeft, bottomCenter, bottomRight]
  
};

//----------------------------

const ctx = {
  ...CoreConfig.ctx,
  W: {
    ...Widgets
  },
  O: {
    ...CustomOperators
  },
  RCE: (C: any, P: any) => React.createElement(C, P),
  utils: {
    ...CoreConfig.ctx.utils,
    ColorUtils,
  }
};

//----------------------------

let config: any = {
  conjunctions,
  operators,
  widgets,
  types,
  settings,
  ctx,
};
config = Utils.ConfigMixins.removeMixins(config, [
  "rangeslider",
  "treeselect",
  "treemultiselect",
]);

export default config;



