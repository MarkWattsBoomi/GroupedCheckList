import { FlowDisplayColumn } from "flow-component-model";
import React from "react";
import { oObject, oObjects } from "./ObjectModel";
import "./GroupedCheckListGroupMember.css";
import GroupedCheckList from "./GroupedCheckList";

export class GroupedCheckListGroupMember extends React.Component<any,any> {

    constructor(props: any) {
        super(props);
    }

    render() {
        let projects: GroupedCheckList = this.props.projects;
        let project: oObject = projects.projects.getObject(this.props.projectId);
        let cols: any[] = [];
        projects.model.displayColumns.forEach((col: FlowDisplayColumn) => {
            //let attrName: string = projects.projects.getAttributeForDisplayColumn(col.developerName);
            let attrValue: any = project.attributes.get(col.developerName).getDisplayString();
            cols.push(
                <span
                    className="grpchklstgrpmem-data-col"
                >
                    {attrValue}
                </span>
            );
        });


        
        return(
            <div
                className="grpchklstgrpmem"
            >
                <div
                    className="grpchklstgrpmem-checkbox-col"
                >
                    <input 
                        className="grpchklstgrpmem-checkbox"
                        type="checkbox"
                        checked={projects.projects.isSelected(this.props.projectId)}
                        onChange={(e: any) => {projects.projects.selectItem(this.props.projectId,e.currentTarget.checked); this.forceUpdate()}}
                    />
                </div>
                
                {cols}
            </div>
        );
    }
}