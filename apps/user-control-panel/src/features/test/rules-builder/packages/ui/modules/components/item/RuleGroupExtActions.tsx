import React, { PureComponent } from "react";

interface RuleGroupExtActionsProps {
  config: any;
  addRule: any;
  addGroup: any;
  canAddRule?: boolean;
  canAddGroup?: boolean;
  canDeleteGroup?: boolean;
  removeSelf: any;
  setLock: any;
  isLocked?: boolean;
  isTrueLocked?: boolean;
  id: string;
}

export class RuleGroupExtActions extends PureComponent<RuleGroupExtActionsProps> {
  render(): React.ReactElement {
    const {
      config, 
      addRule, addGroup, canAddRule, canAddGroup, canDeleteGroup, removeSelf, 
      setLock, isLocked, isTrueLocked, id,
    } = this.props;
    const {
      immutableGroupsMode, addSubRuleLabel, addSubGroupLabel, delGroupLabel,
      renderButton, renderIcon, renderSwitch, renderButtonGroup,
      lockLabel, lockedLabel, showLock, canDeleteLocked,
    } = config.settings;
    const Icon = (pr: any) => renderIcon(pr, config.ctx);
    const Btn = (pr: any) => renderButton(pr, config.ctx);
    const Switch = (pr: any) => renderSwitch(pr, config.ctx);
    const BtnGrp = (pr: any) => renderButtonGroup(pr, config.ctx);

    const setLockSwitch = showLock && !(isLocked && !isTrueLocked) && <Switch 
      type="lock" id={id} value={isLocked} setValue={setLock} label={lockLabel} checkedLabel={lockedLabel} config={config}
    />;

    const addSubRuleBtn = !immutableGroupsMode && canAddRule && !isLocked && <Btn 
      type="addSubRule" onClick={addRule} label={addSubRuleLabel} readonly={isLocked} config={config} renderIcon={Icon}
    />;

    const addSubGroupBtn = !immutableGroupsMode && canAddGroup && !isLocked && <Btn
      type="addSubGroup" onClick={addGroup} label={addSubGroupLabel} readonly={isLocked} config={config} renderIcon={Icon}
    />;
  
    const delGroupBtn = !immutableGroupsMode && canDeleteGroup && (!isLocked || isLocked && canDeleteLocked) && <Btn 
      type="delRuleGroup" onClick={removeSelf} label={delGroupLabel} config={config} renderIcon={Icon}
    />;

    return (
      <div className={"group--actions group--actions--tr"}>
        <BtnGrp config={config}>
          {setLockSwitch}
          {addSubRuleBtn}
          {addSubGroupBtn}
          {delGroupBtn}
        </BtnGrp>
      </div>
    );
  }
}


