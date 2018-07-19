<?xml version="1.0" encoding="UTF-8"?>
<Workflow xmlns="http://soap.sforce.com/2006/04/metadata">
    <rules>
        <fullName>Populate WO fields on create</fullName>
        <active>false</active>
        <criteriaItems>
            <field>WorkOrder.Status</field>
            <operation>equals</operation>
            <value>In Progress</value>
        </criteriaItems>
        <description>Populate WO fields on create</description>
        <triggerType>onCreateOnly</triggerType>
    </rules>
</Workflow>
