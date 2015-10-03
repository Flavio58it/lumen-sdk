package org.lskk.lumen.core;

import org.joda.time.DateTime;

/**
 * http://doc.aldebaran.com/1-14/naoqi/audio/alaudioplayer-api.html
 */
public class PlayAudio implements LumenThing {

    private String name;
    private String contentType;
    private Long contentSize;
    private DateTime uploadDate;
    private DateTime dateCreated;
    private DateTime dateModified;
    private DateTime datePublished;
    private String contentUrl;

    /**
     * Supported format is PCM WAV and MP3. Supported schemes:
     *
     * <ol>
     *     <li>file:// : File must already be in NAO's filesystem.</li>
     *     <li>data: : It will be uploaded to NAO filesystem, then played locally.</li>
     *     <li>http(s): : It will be downloaded, uploaded to NAO filesystem, then played locally.</li>
     * </ol>
     *
     * @return
     */
    public String getContentUrl() {
        return contentUrl;
    }

    public void setContentUrl(String contentUrl) {
        this.contentUrl = contentUrl;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Long getContentSize() {
        return contentSize;
    }

    public void setContentSize(Long contentSize) {
        this.contentSize = contentSize;
    }

    public DateTime getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(DateTime uploadDate) {
        this.uploadDate = uploadDate;
    }

    public DateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(DateTime dateCreated) {
        this.dateCreated = dateCreated;
    }

    public DateTime getDateModified() {
        return dateModified;
    }

    public void setDateModified(DateTime dateModified) {
        this.dateModified = dateModified;
    }

    public DateTime getDatePublished() {
        return datePublished;
    }

    public void setDatePublished(DateTime datePublished) {
        this.datePublished = datePublished;
    }

    @Override
    public String toString() {
        return "PlayAudio{" +
                "name='" + name + '\'' +
                ", contentType='" + contentType + '\'' +
                ", contentSize=" + contentSize +
                ", uploadDate=" + uploadDate +
                ", dateCreated=" + dateCreated +
                ", dateModified=" + dateModified +
                ", datePublished=" + datePublished +
                ", contentUrl='" + contentUrl + '\'' +
                '}';
    }
}
