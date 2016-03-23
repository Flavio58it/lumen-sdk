package org.lskk.lumen.core;

/**
 * Based on <a href="http://emotion-research.net/projects/humaine/earl">HUMAINE EARL</a>
 * and <a href="https://en.wikipedia.org/wiki/Contrasting_and_categorization_of_emotions#Plutchik.27s_wheel_of_emotions">Plutchik's</a>.
 * Created by ceefour on 07/10/2015.
 */
public enum EmotionKind {
    NEUTRAL,
    /**
     * Happiness is a mental or emotional state of well-being defined by positive or pleasant emotions ranging from contentment to intense joy. A variety of biological, psychological, religious and philosophical approaches have striven to define happiness and identify its sources. Various research groups, including positive psychology, are employing the scientific method to research questions about what "happiness" is, and how it might be attained.
     */
    JOY,
    /**
     * In a social context, trust has several connotations. Definitions of trust typically refer to a situation characterized by the following aspects: One party (trustor) is willing to rely on the actions of another party (trustee); the situation is directed to the future. In addition, the trustor (voluntarily or forcedly) abandons control over the actions performed by the trustee. As a consequence, the trustor is uncertain about the outcome of the other's actions; they can only develop and evaluate expectations. The uncertainty involves the risk of failure or harm to the trustor if the trustee will not behave as desired. Vladimir Ilych Lenine expresses this idea with the sentence “Trust is good, control is better”.
     */
    TRUST,
    /**
     * Fear is a feeling induced by perceived danger or threat that occurs in certain types of organisms, which causes a change in metabolic and organ functions and ultimately a change in behavior, such as fleeing, hiding or freezing from perceived traumatic events. Fear in human beings may occur in response to a specific stimulus occurring in the present, or in anticipation or expectation of a future threat perceived as a risk to body or life. The fear response arises from the perception of danger leading to confrontation with or escape from/avoiding the threat (also known as the fight-or-flight response), which in extreme cases of fear (horror and terror) can be a freeze response or paralysis.
     */
    FEAR,
    /**
     * Surprise is a brief mental and physiological state, a startle response experienced by animals and humans as the result of an unexpected event. Surprise can have any valence; that is, it can be neutral/moderate, pleasant, unpleasant, positive, or negative. Surprise can occur in varying levels of intensity ranging from very-surprised, which may induce the fight-or-flight response, or little-surprise that elicits a less intense response to the stimuli.
     */
    SURPRISE,
    /**
     * Sadness (also called heavy-heartedness) is emotional pain associated with, or characterized by feelings of disadvantage, loss, despair, grief, helplessness, disappointment and sorrow. An individual experiencing sadness may become quiet or lethargic, and withdraw themselves from others. An example of severe sadness is depression. Crying is often an indication of sadness.
     */
    SADNESS,
    /**
     * Disgust is an emotional response of revulsion to something considered offensive, distasteful, or unpleasant. In The Expression of the Emotions in Man and Animals, Charles Darwin wrote that disgust is a sensation that refers to something revolting. Disgust is experienced primarily in relation to the sense of taste (either perceived or imagined), and secondarily to anything which causes a similar feeling by sense of smell, touch, or vision. Musically sensitive people may even be disgusted by the cacophony of inharmonious sounds. Research continually has proven a relationship between disgust and anxiety disorders such as arachnophobia, blood-injection-injury type phobias, and contamination fear related obsessive–compulsive disorder (also known as OCD).
     */
    DISGUST,
    /**
     * Anger or wrath is an intense emotional response. It is a normal emotion that involves a strong uncomfortable and emotional response to a perceived provocation. Often it indicates when one's personal boundaries are violated. Some have a learned tendency to react to anger through retaliation. Anger may be utilized effectively by setting boundaries or escaping from dangerous situations. Some people describe anger as a normal emotion that involves a strong uncomfortable and emotional response to a perceived provocation. Raymond Novaco of UC Irvine, who since 1975 has published a plethora of literature on the subject, stratified anger into three modalities: cognitive (appraisals), somatic-affective (tension and agitations), and behavioral (withdrawal and antagonism). William DeFoore, an anger-management writer, described anger as a pressure cooker: we can only apply pressure against our anger for a certain amount of time until it explodes.
     */
    ANGER,
    /**
     * Anticipation, or being enthusiastic, is an emotion involving pleasure, excitement, and sometimes anxiety in considering some expected or longed-for good event.
     */
    ANTICIPATION
}
