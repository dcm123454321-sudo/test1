package com.example.twitterclient.model;

public class Tweet {
    private final String displayName;
    private final String username;
    private final String text;

    public Tweet(String displayName, String username, String text) {
        this.displayName = displayName;
        this.username = username;
        this.text = text;
    }

    public String getDisplayName() { return displayName; }
    public String getUsername() { return username; }
    public String getText() { return text; }
}
