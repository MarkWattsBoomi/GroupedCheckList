import { eContentType, FlowDisplayColumn, FlowObjectData, FlowObjectDataArray, FlowObjectDataProperty, FlowOutcome } from "flow-component-model";

export class oObjectConf {
    sortByProperty: string;
    groupByProperty: string;
    displayColumns: FlowDisplayColumn[];
    onClickOutcome: FlowOutcome;
    clickEnableAttribute: string;
}

export class oObjects {
    // all the projects keyed on internal ID
    items: Map<string, oObject>;
    // string keyed map of group names containing an array of internal IDs of group members
    groups: Map<string, string[]>;
    //the config values on how to read the data
    conf: oObjectConf;
    // holds checked projects
    selectedItems: string[];
    // callback function to notify changes of selection
    changeHandler: ()=>void;
    // string to filter by
    filter: string;
    // callback function to notify changes of selection
    redrawHandler: ()=>void;

    constructor() {
        this.items = new Map();
        this.groups = new Map();
        this.selectedItems = [];
    }

    static parse(src: FlowObjectDataArray, conf: oObjectConf, changeHandler: ()=>void, redrawHandler: ()=>void) : oObjects {
        let projects: oObjects = new oObjects();
        projects.changeHandler = changeHandler;
        projects.redrawHandler = redrawHandler;
        projects.conf = conf;
        if(src && src.items.length > 0) {
            src.items.forEach((item: FlowObjectData) => {
                let prj: oObject = oObject.parse(item, conf);
                projects.items.set(prj.internalId, prj);
                if(!projects.groups.has(prj.attributes.get(conf.groupByProperty).getDisplayString())) {
                    projects.groups.set(prj.attributes.get(conf.groupByProperty).getDisplayString(),[]);
                }
                projects.groups.get(prj.attributes.get(conf.groupByProperty).getDisplayString()).push(prj.internalId);
            });
        }
        return projects
    }

    getGroups() : string[] {
        let groups: string[] = [];
        this.groups.forEach((group: string[], key: string) => {
            groups.push(key);
        });
        groups=groups.sort();
        return groups;
    }

    getGroup(groupName: string) : oObject[] {
        // gets the internal id's of all group projects
        let groupMembers: string[] = this.groups.get(groupName);
        let groups: oObject[] = [];
        groupMembers.forEach((internalId: string) => {
            groups.push(this.items.get(internalId));
        });
        if(this.filter?.length > 0) {
            groups=groups.filter((a) => {
                let match: boolean = false;
                this.conf.displayColumns.forEach((col: FlowDisplayColumn) => {
                    if((a.attributes.get(col.developerName).value + "").toLowerCase().indexOf(this.filter.toLowerCase()) >= 0) {
                        match=true;
                    }
                });
                return match;                
            });
        }
        if(this.conf.sortByProperty && this.conf.sortByProperty.length > 0) {
            groups=groups.sort((a,b) => {
                if(a.attributes.get(this.conf.sortByProperty).value < b.attributes.get(this.conf.sortByProperty).value) return -1;
                if(a.attributes.get(this.conf.sortByProperty).value > b.attributes.get(this.conf.sortByProperty).value) return 1;
                return 0;
            });
        }
        return groups;
    }

    getObject(internalId: string) : oObject {
        return this.items.get(internalId);
    }

    selectItem(internalId: string, selected: boolean) {
        if(selected === true) {
            if(this.selectedItems.indexOf(internalId) < 0 ) {
                this.selectedItems.push(internalId);
                this.notifyChange();
            }
        }
        else {
            if(this.selectedItems.indexOf(internalId) >= 0 ) {
                this.selectedItems.splice(this.selectedItems.indexOf(internalId),1);
                this.notifyChange();
            }
        }
    }

    setFilter(filter: string) {
        this.filter = filter;
        if(this.redrawHandler) {
            this.redrawHandler();
        }
    }

    notifyChange() {
        if(this.changeHandler) {
            this.changeHandler();
        }
    }

    isSelected(internalId: string) : boolean {
        return this.selectedItems.indexOf(internalId)>=0? true : false;
    }

    makeSelectedObjectArray() : FlowObjectDataArray {
        let selected: FlowObjectDataArray = new FlowObjectDataArray();
        this.selectedItems.forEach((internalId: string) => {
            selected.addItem(this.items.get(internalId).objectData);
        });
        return selected
    }
}

export class oObject {
    internalId: string;
    objectData: FlowObjectData;
    //group: string;
    //type: string;
    //code: string;
    attributes: Map<string,oObjectAttribute>;

    constructor() {
        this.attributes = new Map();
    }

    static parse(src: FlowObjectData, conf: oObjectConf) : oObject {
        let prj: oObject = new oObject();
        prj.internalId = src.internalId;
        prj.objectData = src;
        Object.keys(src.properties).forEach((key: string) => {
            let attr: oObjectAttribute = oObjectAttribute.parse(src.properties[key]);
            prj.attributes.set(attr.name, attr);
        });
        //prj.name = src.properties[conf.nameProperty]?.value as string;
        //prj.description = src.properties[conf.descriptionProperty]?.value as string;
        //prj.group = src.properties[conf.groupByProperty]?.value as string;
        if(prj.attributes.get(conf.groupByProperty).getDisplayString().length === 0) {
            prj.attributes.get(conf.groupByProperty).value = "Unknown";
        }
        return prj;
    }
}

export class oObjectAttribute {
    name: string;
    type: eContentType;
    value: any;

    static parse(attr: FlowObjectDataProperty) : oObjectAttribute {
        let prop: oObjectAttribute = new oObjectAttribute();
        prop.name = attr.developerName;
        prop.type = attr.contentType;
        prop.value = attr.value;
        return prop;
    }

    getDisplayString() : string {
        let disp: string = "";
        switch(this.type) {
            case eContentType.ContentString:
                disp = this.value as string;
                break;
            case eContentType.ContentNumber:
                disp = "" + this.value;
                break;
            case eContentType.ContentBoolean:
                disp = this.value === true? "True" : "False";
                break;
            case eContentType.ContentDateTime:
                let dt: Date = new Date(this.value);
                if(isNaN(dt.getTime())){
                    disp = "";
                }
                else {
                    disp = dt.toLocaleDateString();
                }
                break;
            default:
                disp = "Unsupported column content type";
                break;
        }
        return disp;
    }
}