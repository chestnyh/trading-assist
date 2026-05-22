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


interface GroupActionsProps {
  config: any;
  addRule: any;
  addGroup: any;
  removeSelf: any;
  setLock: any;
  isLocked?: boolean;
  isTrueLocked?: boolean;
  id: string;
  parentField?: string;
  canAddGroup?: boolean;
  canAddRule?: boolean;
  canDeleteGroup?: boolean;
}

export class GroupActions extends PureComponent<GroupActionsProps> {
  render(): React.ReactElement {
    const {
      config, 
      addRule, addGroup, removeSelf, setLock, isLocked, isTrueLocked, id, parentField,
      canAddGroup, canAddRule, canDeleteGroup
    } = this.props;
    const {
      immutableGroupsMode, addRuleLabel, addGroupLabel, addSubRuleLabel, addSubGroupLabel, 
      delGroupLabel, groupActionsPosition, 
      renderButton, renderIcon, renderSwitch, renderButtonGroup,
      lockLabel, lockedLabel, showLock, canDeleteLocked,
    } = config.settings;
    const Icon = (pr: any) => renderIcon(pr, config.ctx);
    const Btn = (pr: any) => renderButton(pr, config.ctx);
    const Switch = (pr: any) => renderSwitch(pr, config.ctx);
    const BtnGrp = (pr: any) => renderButtonGroup(pr, config.ctx);
    const position = groupActionsPositionList[groupActionsPosition || defaultPosition];

    const setLockSwitch = showLock && !(isLocked && !isTrueLocked) && <Switch 
      type="lock" id={id} value={isLocked} setValue={setLock} label={lockLabel} checkedLabel={lockedLabel} config={config}
    />;

    const addRuleBtn = !immutableGroupsMode && canAddRule && !isLocked && <Btn
      type={parentField ? "addSubRule" : "addRule"} onClick={addRule} label={parentField ? addSubRuleLabel : addRuleLabel} readonly={isLocked} config={config} renderIcon={Icon}
    />;
    const addGroupBtn = !immutableGroupsMode && canAddGroup && !isLocked && <Btn
      type={parentField ? "addSubGroup" : "addGroup"} onClick={addGroup} label={parentField ? addSubGroupLabel : addGroupLabel} readonly={isLocked} config={config} renderIcon={Icon}
    />;
    const delGroupBtn = !immutableGroupsMode && canDeleteGroup && (!isLocked || isLocked && canDeleteLocked) && <Btn
      type="delGroup" onClick={removeSelf} label={delGroupLabel} config={config} renderIcon={Icon}
    />;

    return (
      <div className={`group--actions ${position}`}>
        <BtnGrp config={config}>
          {setLockSwitch}
          {addRuleBtn}
          {addGroupBtn}
          {delGroupBtn}
        </BtnGrp>
      </div>
    );
  }
}


