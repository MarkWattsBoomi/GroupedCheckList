import React from "react";
import { oObject } from "./ObjectModel";
import "./GroupedCheckListGroup.css";
import { GroupedCheckListGroupMember } from "./GroupedCheckListGroupMember";
import GroupedCheckList from "./GroupedCheckList";

export class GroupedCheckListGroup extends React.Component<any,any> {

    constructor(props: any) {
        super(props);
        this.state = {expanded: true}
        this.toggleExpanded = this.toggleExpanded.bind(this);
    }

    toggleExpanded(e: any) {
        this.setState({expanded: !this.state.expanded});
    }

    render() {
        let projects: GroupedCheckList = this.props.projects;
        let content: any[] = [];
        if(this.state.expanded === true) {
            let groupMembers: oObject[] = projects.projects.getGroup(this.props.group);
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