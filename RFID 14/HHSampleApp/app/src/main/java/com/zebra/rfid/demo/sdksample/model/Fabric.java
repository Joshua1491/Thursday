package com.zebra.rfid.demo.sdksample.model;

public class Fabric {
    private String epc;
    private String name;
    private String colour;
    private double weight;
    private String location;
    private String tagIssuedOn;
    private String rollType;

    public Fabric(String epc, String name, String colour, double weight, String location, String tagIssuedOn, String rollType) {
        this.epc = epc;
        this.name = name;
        this.colour = colour;
        this.weight = weight;
        this.location = location;
        this.tagIssuedOn = tagIssuedOn;
        this.rollType = rollType;
    }

    // Getters
    public String getEpc() {
        return epc;
    }

    public String getName() {
        return name;
    }

    public String getColour() {
        return colour;
    }

    public double getWeight() {
        return weight;
    }

    public String getLocation() {
        return location;
    }

    public String getTagIssuedOn() {
        return tagIssuedOn;
    }

    public String getRollType() {
        return rollType;
    }

    // Setters
    public void setEpc(String epc) {
        this.epc = epc;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setColour(String colour) {
        this.colour = colour;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setTagIssuedOn(String tagIssuedOn) {
        this.tagIssuedOn = tagIssuedOn;
    }

    public void setRollType(String rollType) {
        this.rollType = rollType;
    }
} 