import React from "react";
import { oObject } from "./ObjectModel";
import "./GroupedCheckListGroup.css";
import { GroupedCheckListGroupMember } from "./GroupedCheckListGroupMember";
import GroupedCheckList from "./GroupedCheckList";

export class GroupedCheckListGroup extends React.Component<any,any> {

    constructor(props: any) {
        super(props);
        let projects: GroupedCheckList = this.props.projects;
        let expanded: boolean;
        switch(projects.expandedMode) {
            case "all":
                expanded=true;
                break;
            case "none":
                expanded=false;
                break;
            case "first":
                if(this.props.isFirst === true) {
                    expanded=true;
                }
                else {
                    expanded=false;
                }
                break;
            default:
                expanded=true;
                break;
        }
        this.state = {expanded: expanded}
        this.toggleExpanded = this.toggleExpanded.bind(this);
    }

    toggleExpanded(e: any) {
        this.setState({expanded: !this.state.expanded});
    }

    render() {
        let projects: GroupedCheckList = this.props.projects;
        let content: any[] = [];
        let groupMembers: oObject[] = projects.projects.getGroup(this.props.group);
        if(this.state.expanded === true) {
            
            groupMembers.forEach((grpchklst: oObject) => {
                content.push(
                    <GroupedCheckListGroupMember 
                        projects={this.props.projects}
                        group={this}
                        projectId={grpchklst.internalId}
                    />
                );
            });
        }

        let expander: any;
        if(groupMembers.length > 0) {
            if(this.state.expanded === true) {
                expander = (
                    <span
                        className="grpchklstgrp-expander glyphicon glyphicon-chevron-up"
                        onClick={this.toggleExpanded}
                    />
                );
            }
            else {
                expander = (
                    <span
                        className="grpchklstgrp-expander glyphicon glyphicon-chevron-down"
                        onClick={this.toggleExpanded}
                    />
                );
            }
        }
        else {
            expander = (
                <div
                    className="grpchklstgrp-expander"
                />
            );
        }

        return(
            <div
                className="grpchklstgrp"
            >
                <div
                    className="grpchklstgrp-header"
                >
                    {expander}
                    <span
                        className="grpchklstgrp-header-label"
                    >
                        {this.props.group}
                    </span>
                </div>
                <div
                    className="grpchklstgrp-body"
                >
                    {content}
                </div>
            </div>
        );
    }
}