package com.zebra.rfid.demo.sdksample.model;

public class FabricTagData {
    private String name;
    private String location;

    // Default constructor
    public FabricTagData() {}

    // Full-argument constructor
    public FabricTagData(String name, String location) {
        this.name = name;
        this.location = location;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    /**
     * Serializes the FabricTagData object into a string with fields separated by "|"
     * @return String containing all fields joined by "|"
     */
    public String serialize() {
        return String.join("|",
                name != null ? name : "",
                location != null ? location : ""
        );
    }

    /**
     * Deserializes a string into a FabricTagData object
     * @param data String containing fields separated by "|"
     * @return FabricTagData object with populated fields
     */
    public static FabricTagData deserialize(String data) {
        if (data == null || data.isEmpty()) {
            return new FabricTagData();
        }
        String[] fields = data.split("\\|");
        FabricTagData tagData = new FabricTagData();
        if (fields.length >= 1) tagData.setName(fields[0]);
        if (fields.length >= 2) tagData.setLocation(fields[1]);
        return tagData;
    }
} 