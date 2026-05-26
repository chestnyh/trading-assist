import React, { PureComponent } from "react";

const groupActionsPositionList: Record<string, string> = {
  topLeft: "group--actions--tl",
  topCenter: "group--actions--tc",
  topRight: "group--actions--tr",
  bottomLeft: "group--actions--bl",
  bottomCenter: "group--actions--bc",
  bottomRight: "group--actions--br"
};
const defaultPosition = "topRight";


interface SwitchGroupActionsProps {
  config: any;
  addCaseGroup: any;
  addDefaultCaseGroup: any;
  setLock: any;
  isLocked?: boolean;
  isTrueLocked?: boolean;
  id: string;
  canAddGroup?: boolean;
  canAddDefault?: boolean;
}

export class SwitchGroupActions extends PureComponent<SwitchGroupActionsProps> {
  render(): React.ReactElement {
    const {
      config, 
      addCaseGroup, addDefaultCaseGroup, setLock, isLocked, isTrueLocked, id, canAddGroup, canAddDefault
    } = this.props;
    const {
      immutableGroupsMode, addCaseLabel, addDefaultCaseLabel, groupActionsPosition, 
      renderButton, renderIcon, renderSwitch, renderButtonGroup,
      lockLabel, lockedLabel, showLock,
    } = config.settings;
    const Icon = (pr: any) => renderIcon(pr, config.ctx);
    const Btn = (pr: any) => renderButton(pr, config.ctx);
    const Switch = (pr: any) => renderSwitch(pr, config.ctx);
    const BtnGrp = (pr: any) => renderButtonGroup(pr, config.ctx);
    const position = groupActionsPositionList[groupActionsPosition || defaultPosition];

    const setLockSwitch = showLock && !(isLocked && !isTrueLocked) && <Switch 
      type="lock" id={id} value={isLocked} setValue={setLock} label={lockLabel} checkedLabel={lockedLabel} config={config}
    />;

    const addCaseGroupBtn = !immutableGroupsMode && canAddGroup && !isLocked && <Btn
      type="addCaseGroup" onClick={addCaseGroup} label={addCaseLabel} readonly={isLocked} config={config} renderIcon={Icon}
    />;

    const addDefaultCaseGroupBtn = !immutableGroupsMode && canAddDefault && !isLocked && <Btn
      type="addDefaultCaseGroup" onClick={addDefaultCaseGroup} label={addDefaultCaseLabel} readonly={isLocked} config={config} renderIcon={Icon}
    />;

    return (
      <div className={`group--actions ${position}`}>
        <BtnGrp config={config}>
          {setLockSwitch}
          {addCaseGroupBtn}
          {addDefaultCaseGroupBtn}
        </BtnGrp>
      </div>
    );
  }
}


