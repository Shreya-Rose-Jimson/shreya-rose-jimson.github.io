# Attention is all you need

I’ve recently started diving into the world of Transformers — the architecture that’s become the backbone of modern machine learning, especially in natural language processing. As I explore and try to understand these concepts, I’m documenting my learning journey here. This article is not a comprehensive tutorial, but rather a collection of notes, insights, and explanations that have helped me grasp the fundamentals. Once I get a solid understanding of Transformers, I’ll be moving on to Vision Transformers (ViTs) to see how these ideas extend into the world of computer vision. Hopefully, this post can be helpful to others who are also learning, or at least offer a useful perspective along the way.

# **Introduction — What are transformers?**

![gif](https://media1.tenor.com/m/JsaGtpmSab0AAAAC/jazz-transformers.gif)

The transformer we’re referring to here is different from what one might think when they first hear the phrase.

In essence, a transformer is something that transforms from sequence into another.

A transformer consists of two main parts — the encoder and decoder.

The encoder works on the input sequence. The decoder operates on the target output sequence.

![[https://www.youtube.com/watch?v=ZXiruGOCn9s](https://www.youtube.com/watch?v=ZXiruGOCn9s)](https://miro.medium.com/v2/resize:fit:288/1*65-3eoPKXusOX26r4N58xw.png)

[https://www.youtube.com/watch?v=ZXiruGOCn9s](https://www.youtube.com/watch?v=ZXiruGOCn9s)

For example in language translation: we translate a sentence or a phrase from one language, say English to say it’s French equivalent. Translations cannot be done word by word. The order of words and contextual meanings vary in each language.

Transformers work through sequence to sequence learning.

It does this by iterating through encoder layers.

— >encoder ⇒ generates encoding — that defines which part of the input sequence are relevant to each other, and then passes these encoding to the next encoding layer.

— > decoder ⇒ takes all of these encodings and uses their derived context to generate the output sequence.

Transformers are a form of semi supervised learning. By “semi-supervised” we mean that they are pretrained in an unsupervised manner with a large unlabeled dataset, and then they are finetuned through supervised methods to try and get them to perform better.

Transformers use something known as an “attention mechanism”

![gif](https://media1.tenor.com/m/wlhCF3MLAZkAAAAC/attention-warning.gif)

This provides context around items in the input sequence. So with respect to our initial example of sentence translation — the transformer attempts to identify the context and bring meaning to each word in the sequence. And it’s this “attention” mechanism that gives Transformers a huge advantage over algorithms like RNN that must run in sequence. TRANSFORMERS RUN MULTIPLE SEQUENCES IN PARALLEL. This vastly speeds up training speed.

# **Recurrent Neural Networks(RNN)**

These were networks that were used before the transformers for most of the sequence to sequence tasks.

![](https://miro.medium.com/v2/resize:fit:1050/1*zDKogaW1Zbg7lZ1jdfI2Ow.png)

[https://www.exxactcorp.com/blog/Deep-Learning/recurrent-neural-networks-rnn-deep-learning-for-sequential-data](https://www.exxactcorp.com/blog/Deep-Learning/recurrent-neural-networks-rnn-deep-learning-for-sequential-data)

Say we have an input sequence X and we want and output sequence Y, what we did was we split the input sequence into multiple items. So we gave the recurrent neural neural network the first item as input, along with an initial state (usually consists of all zeros).

So at step 0 we would take the input token and then produce the output h0. Then for the next time step, the output of the previous stage is taken as the “hidden state” of the network along with the next input token X1 and produces the next output token H1. So this repeats for all subsequent stages. If we have N tokens, we need N steps to map an N sequence input into an N sequence output.

# **Okay, so what was lacking??**

![gif](https://media1.tenor.com/m/Mnpge7A51y8AAAAC/something-is-missing-blippi.gif)

The problems with RNN(among others):

1. Slow Computation for long sequences — because same operation is repeated for every token in input. So longer the sequence, longer the computation time.
2. Vanishing or Exploding gradients —
3. For example, frameworks like Pytorch convert our networks into a computation graph.

![](https://miro.medium.com/v2/resize:fit:1050/1*xM10nrsEU4JDmlrIykYlSw.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

Consider the computation graph shown. Consider inputs ‘x’ and ‘y’. So our first function f(x,y) = x.y. So our inputs x and y are multiplied and let us call that result ‘z’. This map is then given to another function g(z) = z².

So what Pytorch does is it calculates the derivative of the “LOSS FUNCTION” with respect to it’s weights. We observe, that longer the chain of computation i.e. we have many nodes, longer will be the chain of multiplication.

Say each derivative is a small number like 0.5, the resulting product is smaller than the initial number. 0.5x0.5=0.25 and so on. If we have two numbers <1, their product is smaller than either of those two numbers and if we have two numbers >1, their product gets much larger. If we have a very long chain of computation — it will either become a very small number or a very large number — both undesirable. This is because our CPU and GPU can represent numbers only upto a certain precision say 32 bit or 64 bit. And if the number becomes too small, it’s contribution to the output becomes very small.

So say in the case of Pytorch, the framework will calculate how to adjust the weights, and if the number becomes too small the weight will move very slowly because the contribution due to that product is very small AKA — GRADIENT IS VANISHING!

![gif](https://media1.tenor.com/m/7r2iI6IoKpIAAAAC/disappear-poof.gif)

or in the other case it becomes a very large number — EXPLODES

4. Difficulty in accessing information from long time ago —

So we thing of the RNN as a long graph of computation. So when input is given it produces the new hidden state. We will use this hidden state along with the new token to produce the next output.

In the case of a very long sequence, when we reach the end the last stage will produce a hidden state whose contribution from the first token has nearly gone. So in this case the last token is nearly independent from the first. This is a problem because during conversation, tokens from 200 words back are still relevant now.

# **Introducing — TRANSFORMER**

It helps the issues that propped up during the use of RNNs.

![gif](https://media1.tenor.com/m/GquBIoxuIlgAAAAC/im-here-to-save-you-savior.gif)

Starting with the name — it is called that because it “transforms” or changes an input sequence into an output sequence

So they consist of two macro blocks

1. Encoder
2. Decoder

+ a linear layer

![](https://miro.medium.com/v2/resize:fit:1049/1*EOp_Xc5O3xiDsFXmSnY1Iw.png)

[https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf](https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf)

# **Notation**

Dot product basically -

![](https://miro.medium.com/v2/resize:fit:1050/1*GSFVCadfjbKfGYh3hCa3LA.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

In the paper Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, L., & Polosukhin, I. (2017). Attention is all you need. *arXiv (Cornell University)*. [https://doi.org/10.48550/arxiv.1706.03762](https://doi.org/10.48550/arxiv.1706.03762)

they have selected an arbitrary value (arbitrary i think?) dmodel = 512. So for this entire article dmodel =512.

# **Encoder**

![](https://miro.medium.com/v2/resize:fit:516/1*HmlWWrmRLEHdgVJaNh74EA.png)

[https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf](https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf)

# **So, WHAT IS AN INPUT EMBEDDING?????**

![](https://miro.medium.com/v2/resize:fit:413/1*zg8TOCS3cnYmY8IpdiGMBQ.png)

[https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf](https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf)

Consider a sample sentence : “ YOUR CAT IS A LOVELY CAT”

We tokenize the sentence, split it into separate words. Note- not necessary to split it into words — sentence can be split into smaller parts that are smaller than a word.

![](https://miro.medium.com/v2/resize:fit:1050/1*bQYOqZww4m8VQJ6suMa_ng.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

Now these words are assigned numbers — these numbers denote the position of words in our vocabulary(the training set).

![](https://miro.medium.com/v2/resize:fit:1050/1*3L3KdzBZQEZ4FV1jao3eXQ.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

Notice in the above image, both the occurrences of the word “cat” are assigned the same number 6587 i.e., have the same input IDs- this is because they occupy the same position in the vocabulary.

Now these input ids are mapped to a vector of size 512. This vector is a vector made of 512 numbers, and we always map the same word to the same “embedding”. However these numbers are not “fixed”. They are parameters. The model will learn to change the numbers such that they represent the meaning of the word.

SO — input id’s — never change

embeddings — change along with the training process of the model — change according to the needs of the loss function.

![](https://miro.medium.com/v2/resize:fit:1050/1*SKweIoEyV8V_2N3fIfA0dA.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

![](https://miro.medium.com/v2/resize:fit:1050/1*PTJmjNRxuGSAk6ivX5PSBQ.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

# **What is POSITIONAL ENCODING?????**

![](https://miro.medium.com/v2/resize:fit:540/1*iqgRHgHzrUfRjG_qIAgqaA.png)

[https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf](https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf)

- Basically, we want each word to carry some information about it’s position in the sentence.

Now we have built a matrix of embeddings, however, they don’t convey any information about where that particular word is inside the sentence.

- We want the model to treat words that appear close to each other as “close” and words that are distant as “distant”.

In essence, we want the model to see what we see with our eyes — the proximity of words to each other. For example, in the sentence, “What is POSITIONAL ENCODING?”, our eyes can see that the word “What” is closer to the word “is” than it is to the word “encoding”.

So we want to inform the model how the words are spatially distributed inside the sentence.

- We want the positional encoding to represent a pattern that can be learned by the model.

![](https://miro.medium.com/v2/resize:fit:1050/1*5mhGGjv4we_ASI_kG_GyDQ.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

Now, in addition to our previous step, where we had introduced the input embeddings, we now add the positional embeddings.

The “Positional embedding” is a vector of size 512.

Note — positional embedding is not “learned” — it is fixed. It is computed once and stays constant

It represents the position of the word within the sentence.

This now gives us a new vector of size 512.

![](https://miro.medium.com/v2/resize:fit:1050/1*Rtwy2w-YbpwNRnKMpYqcsw.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

# **How the position embeddings calculated?**

![](https://miro.medium.com/v2/resize:fit:593/1*25HBeKJ7TuwSJtSTVrUT-g.png)

[https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf](https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf)

where pos is the position and i is the dimension

basically : (nicer to look at)

![](https://miro.medium.com/v2/resize:fit:998/1*qdwDPVodZyH44avfXJeoZQ.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

We create a vector of size dmodel i.e., of size 512. Now, for each position in this vector, we calculate a value using the above mentioned expressions.

Now the two arguments here:

“pos” = position of the word inside the sentence

“i” = dimension

for the even dimensions i.e., 0, 2 , 510 etc . — use the first expression

for the odd dimensions i.e., 1,3 etc. — use the second expression

Now calculate the embedding for all the words in the sentence.

![](https://miro.medium.com/v2/resize:fit:1050/1*ivphb1Bff7gfr6ZZ81cwsA.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

# **Why trigonometric functions?**

![gif](https://media1.tenor.com/m/YAUMFOCgUu4AAAAC/think.gif)

Why did the authors choose sine and cosine functions to represent the position embeddings?

**Sine and cosine** are **periodic, smooth, differentiable functions** that let the Transformer **encode position in a way that preserves relative distances** and allows generalization.

Trigonometric functions like cos and sine naturally represent a pattern that the model can recognise as continuous, so relative postions are easier to see for the model. By watching the plot of these functions, we can also see a regular pattern, so we hypothesise that the model will see it too.

![](https://miro.medium.com/v2/resize:fit:1050/1*z_hkf8ikoYGfL2tLYicCEw.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

# **What is Self — Attention?**

Before we get to the next part of the encoder — which is the “Multi — Head Attention”, let us understand the concept of “Self Attention”.

This mechanism existed before they introduced the transformer, the authors of the transformer just changed it into a multi head attention.

Self attention allows the model to relate words to each other.

Note:

## **Why is it called that? -**

“attention” refers to the mechanism where the model dynamically weighs the importance of different input elements when processing information — instead of treating them all equally.

**“Self”** refers to the fact that **the input is attending to itself**. More concretely:

- In *self-attention*, each position in the input sequence (e.g., each word in a sentence) looks at **all other positions in the same sequence** to gather context.
- There’s no external source — like another sentence or sequence — providing context; the input uses **itself** as both the “query” and the “key/value” sources.

Consider the sentence:

> “The cat sat on the mat because it was warm”
> 

When processing the word *“it”*, the model needs to figure out what *“it”* refers to. Using **self-attention**, the model can attend to earlier words — like *“cat”* or *“mat”* — to help disambiguate that.

So:

- *“it”* forms a **query**.
- It looks at all tokens in the sentence (including itself), which are used as **keys and values**.
- Based on how relevant each is (computed via attention scores), it decides which parts of the input to focus on when generating its output representation.

Basically **Self-attention** means the model is “paying attention” to other parts of the **same** input sequence to compute a better, context-aware representation of each part.

![](https://miro.medium.com/v2/resize:fit:608/1*FPf84fo8l1aLFcFNt-NYIw.png)

[https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf](https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf)

In this simple case we consider the sequence length seq = 6 and dmodel = 512

The matrices Q, K and V are just the input sentence.

![](https://miro.medium.com/v2/resize:fit:341/1*euMy2HNNZd86PC5hcf-nqw.png)

=

![](https://miro.medium.com/v2/resize:fit:1050/1*HSjLTPPKUfWRbrOKnEYtYQ.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

where

- softmax makes the sum of each row = 1
- the value in each cell is the dot product of the the embeddings of the corresponding words

now we multiply that by V

![](https://miro.medium.com/v2/resize:fit:1050/1*fmRundHsmnHkL2Had88-tw.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

When computing the dot product QK^T, you’re essentially measuring the similarity between queries (Q) and keys (K). If the dimensionality of these vectors, dk, is large, the dot product values can become **very large in magnitude**.

This causes the **softmax function** to produce extremely peaked distributions — where one value dominates, and the rest are nearly zero. That leads to:

- **Vanishing gradients** during training
- **Hard attention** too early in training, preventing the model from learning softer, more nuanced attention patterns

Thus we divide by a root(dk) to:

- Prevent large dot products
- Stabilize the softmax computation
- Ensure smoother gradients and better learning dynamics

## **A few properties of self attention:**

1. Self — Attention is permutation invariant:

Consider a matrix of 4 words A, B, C, D and say it has new embeddings A’, B’, C’, D’. If we say swap the positions of B and C in the input, now, in the resulting embedding, the values of A’, B’, C’, D’ do not change. Just the the positions of B’ and C’ are swapped.

2. As of now, self attention requires no parameters. Up to now, the interaction between words has been driven by their emedding and the positional encodings. This will change later in multi head attention.

3. We expect the values along the diagonal to be the highest.:

Because each value in the self attention — the softmax matrix — is a dot product of the word embeddings with itself and the other words, we expect the values along the diagonal to be the maximum.

![](https://miro.medium.com/v2/resize:fit:918/1*H2qBQ5kAdf5GcpwXMMPYAg.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

4. If we don’t want some positions to interact, we can always set their values to minus infinity before applying the softmax in this matrix and the model will not learn those interactions. We will use this in decoder.

# **Multi-Head Attention (MHA)**

![](https://miro.medium.com/v2/resize:fit:345/1*15c6zmurCY8Qdg-AVheZDA.png)

[https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf](https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf)

Multi-head attention allows the model to attend to information from **different representation subspaces** at different positions. Instead of applying a single attention function, MHA applies **multiple attention mechanisms (heads) in parallel**, then combines their outputs.

# **Note:**

## **Why Have Multiple Heads?**

1. **Learn Diverse Attention Patterns**

Each head can:

- Learn a different similarity space (via WiQ,WiK)
- Focus on different positions or relationships (long-range vs. local)
- Attend to different features (syntax vs. semantics, or shapes vs. textures in ViTs)

For example:

- Head 1: might learn to focus on the previous token
- Head 2: might attend to the verb in a sentence
- Head 3: might look for matching parentheses
- Head 4: might follow coreference chains

All these are **learned jointly**, end-to-end.

Say we are on the encoder side of the transformer:

![](https://miro.medium.com/v2/resize:fit:425/1*C3hV7PMxunw7BbMkigc9dw.png)

[https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf](https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf)

Consider an input sentence 6x512 AKA “6 by dmodel” size. We take this input and make 4 copies of this. One copy is sent to the “Add and Norm” block, three are sent to the “Multi-Head attention”.

![gif](https://media1.tenor.com/m/hcH0NlbryRAAAAAC/dodrio-triple-bird-pokemon.gif)

Those three copies are three matrices equal to input. These are named — Q (query), K (key), V (value) of size seq x dmodel.

![](https://miro.medium.com/v2/resize:fit:479/1*fVuj-Mz86Bd1TSrBPZer5A.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

So now what the multi head attention block does is it takes these three inputs and multiplies each of them with “parameter matrices” — called Wq, Wk, Wd (they have dimensions dmodel by dmodel). So now we get a matrix of size seq x dmodel. The resulting matrices are named Q’, K’, V’.

![](https://miro.medium.com/v2/resize:fit:983/1*Su8GI_x0mzjPSoyMXmxDMw.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

Now, we can split this matrix Q’ by the sequence dimension or by the dmodel dimension.

In the multi — head attention, we always split by dmodel dimension.

![](https://miro.medium.com/v2/resize:fit:720/1*mj--qzh4xy_Jr96BChkfaw.png)

Say we have an embedding of 512, it will become smaller embeddings of 512 /4 — this quantity is called dk.

Where dk = dmodel / h, where h is the number of heads eg. head = 4.

We can calculate the attention between the smaller matrices Q1, K1, V1 using the following expression from the paper:

![](https://miro.medium.com/v2/resize:fit:921/1*lBflLQ0ru9X81RNhl_1qDQ.png)

[https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf](https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf)

This results in small matrices head1, head2, head3, head4. Dimensions of head1 to head4 is seq x dv. dv is basically dk (just rereferred to as dv in the paper).

![](https://miro.medium.com/v2/resize:fit:1050/1*sLWV-iFb1c3Oxkt-IWd8mg.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

Our next task is to combine these small heads (matrices) by concatenating them along the dv dimension. Now, we multiply this concatenation by W^o.

W^o is a trainable weight matrix. It is needed to recombine the outputs of all attention heads into a single representation

![](https://miro.medium.com/v2/resize:fit:1050/1*vQxKCi354XbZvvLdiMn6UA.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

So instead of calculating the attention between the matrices Q’, K’ and V’, the MHA splits them along the dmodel dimension into smaller matrices and calculates the attention between the smaller matrices.

So each head is watching the full sentence, but different aspect of the embedding of each word.

![gif](https://media1.tenor.com/m/HewFmNRxtT4AAAAC/why-persian-room-cat-guardian.gif)

We want each head to watch different aspect of the same word.

For example: the word “fast” can be a noun (e.g. “The fast is broken at sunset”)

it could be an adjective (e.g. “She drives a fast car”)

it could also be an adverb (e.g. “He runs fast”).

Here the same word may be a noun, adjective or adverb depending on the context. So one head might learn to relate that word to a noun, one head might learn to relate it to an adjective, another head might learn to relate it to an adverb. This is why we need multi-head attention.

![](https://miro.medium.com/v2/resize:fit:1050/1*8x2LH7VjNUEN22-iAMBt8A.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

When we calculate attention of Q and K matrices,

![](https://miro.medium.com/v2/resize:fit:198/1*a-KPHQxJP9IVrqr12GHcPw.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

we get a new matrix of size seq x seq which represents a score which represents the intensity of the relationship between the two words. We can visualise this as:

![](https://miro.medium.com/v2/resize:fit:939/1*mhSEy6lSL6ATkD5aWHNysg.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

Consider the word — “making”, we can see that it is related to the word “difficult” with the ‘blue head’, ‘red head’ etc. but the violet or pink head is not relating the two words together. But the pink head is relating the word “making” to “2009”.

# **Why query, keys and values??????????**

![](https://miro.medium.com/v2/resize:fit:578/1*8k5DqLvukq7doshNLVUvyA.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

For example consider a python-like dictionary consisting of ‘keys’ and ‘values’, where ‘keys’ are the genres and ‘values’ are the movies belonging to that genre. Imagine the user makes a query — “love”. Since we are using the transformer model, all these words are represented by embeddings of size 512. So what the transformer does is it converts the word love to an embedding of size 512.

All the keys are already embeddings of size 512. Now it calculates the dot product of the query and all the keys (that softmax formula). This then results in a score that amplifies some values and not amplifiy other values.

![](https://miro.medium.com/v2/resize:fit:1050/1*NXEkE_8OV1ZUVSbd-h2xow.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

So “love” and romantic are the most closely related, “love”is also losely related to “comedy”, but “love” and “horror” are not related at all.

# **Add & Norm**

![](https://miro.medium.com/v2/resize:fit:255/1*l-eks4hF5GwVNygyQf-wJw.png)

[https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf](https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf)

## **So what is layer normalisation?**

For example, consider a batch of 3 items

![](https://miro.medium.com/v2/resize:fit:1050/1*l9_9itbuIF-sSbg52vKRSQ.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

Calculate the mean and the variance of each item independently from each other.

![](https://miro.medium.com/v2/resize:fit:963/1*ZYwlRblfBnXUmNRDBzFi3g.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

Then replace each value with another value given by the following expression:

![](https://miro.medium.com/v2/resize:fit:423/1*SUT_fU-n1iPBao4SC_RWTg.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

Basically, we are normalising to ensure that all the new values are in the range 0 to 1.

We then multiply this value with a parameter ‘gamma’ and then add a parameter ‘beta’. ‘Gamma’ and ‘beta’ are learnable parameters.The values should be learnt such that it amplifies the values that need to be amplified and then doesn’t amplify the values that don’t have to amplified. The network will learn to tune these two parameters to introduce fluctuations where necessary.

![](https://miro.medium.com/v2/resize:fit:1047/1*0NZulPX5Aapd6ic4sCJ30w.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

N = Batch dimension — item number

C = Feature

So, in layer normalistion, we calculate all the values belonging to one item in the batch.

Whereas, in the batch norm, we calculate the same feature for all the batches.

# **Decoder**

![](https://miro.medium.com/v2/resize:fit:462/1*k7I_MgdO1syAWS2HaYOlcg.png)

[https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf](https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf)

# **What is Masked Multi — Head Attention?**

Our goal is to make the model causal: it means the output causal: it means the output at a certain position can only depend on the words on the previous positions. The model **must not be** be able to see future words.

![](https://miro.medium.com/v2/resize:fit:906/1*dXprduvpFGd497CpefgHrQ.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

so all the words above the diagonal are replaced by -infinity before applying the softmax. After applying softmax they are replaced with zero.

# **Inference and training of a transformer model:**

For example if we want to perform the following translation:

![](https://miro.medium.com/v2/resize:fit:390/1*_OzcKUs7RIejuy2cFHjujw.png)

## **Training**

The encoder outputs, for each word a vector that not only captures it’s meaning (the embedding) or the position, but also it’s interaction with other words by the means of the multi — head attention.

![](https://miro.medium.com/v2/resize:fit:792/1*bDXbE0doef_pnz6A7G_nFg.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

SOS — Start of Sentence

EOS — End of Sentence

Output of the encoder is another matrix which has the same dimensions as the input matrix to the encoder.

Note — input and outputs are of same lenghts — so paddings added if necessary.

Linear layer — maps the the embeddings of the decoder output to the corresponding word in our natural vocabulary/dictionary.

![](https://miro.medium.com/v2/resize:fit:1050/1*tExjeCNdcc5Tt3XFpJVm8g.png)

[https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf](https://github.com/hkproj/transformer-from-scratch-notes/blob/main/Diagrams_V2.pdf)

Now that we have the model and the output, we calculate the loss.

![](https://miro.medium.com/v2/resize:fit:1050/1*XfMwCnGHMM-EwgzRWOaWtw.png)

We prepend the <SOS> token at the beginning. That’s why the paper says that the input is shifted right.

When the model sees <SOS> token, it will output the first token as output ‘Ti’, when is sees ‘Ti’, it will output ‘amo’, when it sees ‘amo’, it will output ‘molto’, when it sees ‘molto’ it will output <EOS>.
