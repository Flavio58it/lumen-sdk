package org.lskk.lumen.core;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSetter;
import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;

import javax.xml.bind.annotation.XmlAttribute;
import java.util.Locale;

/**
 * Audio object both for playing audio and recording audio.
 *
 * @see <a href="* http://doc.aldebaran.com/1-14/naoqi/audio/alaudioplayer-api.html">* http://doc.aldebaran.com/1-14/naoqi/audio/alaudioplayer-api.html</a>
 * @see <a href="http://schema.org/AudioObject">schema:AudioObject</a>
 */
public class AudioObject implements LumenThing {

    private String name;
    private String contentType;
    private Long contentSize;
    private DateTime uploadDate;
    private DateTime dateCreated;
    private DateTime dateModified;
    private DateTime datePublished;
    private String contentUrl;
    private String url;
    private String transcript;
    private Locale inLanguage;
    private String category;
    private MediaLayer mediaLayer;
    @JsonIgnore
    private byte[] content;

    /**
     * Supported formats are OGG (recommended), MP3, and PCM WAV. Supported schemes:
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

    @XmlAttribute
    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
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

    /**
     * If this MediaObject is an AudioObject or VideoObject, the transcript of that object.
     * @return
     */
    public String getTranscript() {
        return transcript;
    }

    public void setTranscript(String transcript) {
        this.transcript = transcript;
    }

    /**
     * Language of the {@link #getTranscript()}.
     * @return
     */
    public Locale getInLanguage() {
        return inLanguage;
    }

    @JsonGetter("inLanguage")
    public String getInLanguageAsString() {
        return inLanguage != null ? inLanguage.toLanguageTag() : null;
    }

    public void setInLanguage(Locale inLanguage) {
        this.inLanguage = inLanguage;
    }

    @JsonSetter
    public void setInLanguage(String inLanguage) {
        this.inLanguage = inLanguage != null ? Locale.forLanguageTag(inLanguage) : null;
    }
    /**
     * A category for the item. Greater signs or slashes can be used to informally indicate a category hierarchy.
     * @return
     */
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    @XmlAttribute
    public MediaLayer getMediaLayer() {
        return mediaLayer;
    }

    public void setMediaLayer(MediaLayer mediaLayer) {
        this.mediaLayer = mediaLayer;
    }

    /**
     * Temporary place to put audio content.
     * @return
     */
    public byte[] getContent() {
        return content;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "AudioObject{" +
                "name='" + name + '\'' +
                ", contentType='" + contentType + '\'' +
                ", contentSize=" + contentSize +
                ", uploadDate=" + uploadDate +
                ", dateCreated=" + dateCreated +
                ", dateModified=" + dateModified +
                ", datePublished=" + datePublished +
                ", contentUrl='" + StringUtils.abbreviateMiddle(contentUrl, "…", 80) + '\'' +
                '}';
    }
}
