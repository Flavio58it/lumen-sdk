package org.lskk.lumen.core;

/**
 * <a href="http://www.hydra-cg.com/spec/latest/core/#hydra:Error">hydra:Error</a>
 * Created by ceefour on 10/15/15.
 */
public class Error extends Status {
    private String title;
    private String description;

    public Error() {
    }

    public Error(String title, String description) {
        this.title = title;
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Error{" +
                title + ": " + description +
                '}';
    }
}
