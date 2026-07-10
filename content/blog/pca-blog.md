# PCA — Principal Component Analysis

I have recently started learning about Principal Component Analysis (PCA) and wanted to jot down my understanding so far.

These notes are part of my own learning process, and writing them here helps me organize my thoughts while hopefully making the topic more approachable for anyone else who’s also exploring it. PCA can seem intimidating at first glance, but at its heart, it’s a powerful way to simplify complex datasets and uncover patterns by transforming them into a new set of variables called *principal components*.

In this post, I’ll share the key ideas as I’ve come to understand them.

Principal Component Analysis (PCA) is one of the most widely used techniques for exploring and simplifying complex datasets. At its core, PCA transforms your original variables into a new set of uncorrelated variables called *principal components*, which are ordered by how much of the dataset’s variation they capture. This not only makes it easier to visualize high-dimensional data in just two or three dimensions, but also helps uncover hidden patterns, groupings, or trends that may not be obvious in the raw form. Whether you’re dealing with gene expression profiles, customer behavior data, or image features, PCA acts like a “smart” coordinate transformation, reorienting your data to reveal its most informative structure.

## **The Challenge of High-Dimensional Data: Why PCA?**

Imagine, for a moment, that you’re working with a dataset where each instance is described by, say, a thousand features. Perhaps it’s an image, where each pixel is a feature, and a typical color image might be a data point in a million-dimensional space. Handling such high-dimensional data presents a myriad of challenges: it’s incredibly hard to analyze, challenging to interpret, nearly impossible to visualize, and, from a purely practical standpoint, the storage requirements can be quite expensive.

However, there’s often a silver lining: high-dimensional data frequently possesses inherent properties that we can exploit. For instance, many dimensions might be redundant or highly correlated, meaning that they can be explained or approximated by a combination of other, fewer dimensions. This suggests that the data might reside on an *intrinsic lower-dimensional structure*. This is precisely where **dimensionality reduction** comes into play. You can think of it as a form of data compression, much like how JPEG compresses images or MP3 compresses music, reducing the data size ideally without significant loss of critical information.

## **Introducing Principal Component Analysis (PCA)**

Within the realm of dimensionality reduction, **Principal Component Analysis (PCA)** stands out as a highly effective and widely used algorithm for **linear dimensionality reduction**. First proposed independently by Karl Pearson in 1901 and Harold Hotelling in 1933, PCA has remained a cornerstone technique for over a century for tasks such as data compression, data visualization, and the identification of underlying patterns or “latent factors” in high-dimensional datasets.

It’s crucial to understand that PCA is an **unsupervised** method. This means that, unlike classification or regression, PCA does *not* use any output information or labels when it learns the compressed representation. Its focus is purely on the intrinsic structure of the input data itself.

### **The Core Problem Setting**

At its heart, PCA seeks to transform a high-dimensional dataset into a lower-dimensional representation while preserving as much of the original information as possible.

Let’s consider a dataset X = {x₁, …, xₙ}, where each data point xₙ is a vector in R^D.

A common preprocessing step for PCA is to mean-center the data, which means subtracting the mean vector from every data point such that the dataset now has a mean of zero. This centering simplifies the subsequent calculations and helps avoid numerical issues.

After centering, we compute the data covariance matrix, S, which captures the relationships and variances between the different dimensions:

S = (1 / N) * Σ (from n=1 to N) [ xₙ * xₙ^T ]

The goal is to find a lower-dimensional compressed representation or “code”, zₙ in R^M, where M < D. This compression is achieved through a linear transformation. We can think of two operations:

1. An encoder, which maps the original high-dimensional data xₙ to its low-dimensional code zₙ:

zₙ = B^T * xₙ

2. A decoder, which attempts to reconstruct an approximation of the original data, x̃ₙ, from its low-dimensional code zₙ:

x̃ₙ = B * zₙ

Here, B is a D x M matrix whose columns form an orthonormal basis (ONB) of the new, lower-dimensional subspace, often called the principal subspace.

### **Two Illuminating Perspectives on PCA**

PCA can be derived and understood from two intimately related perspectives:

1. Maximum Variance Perspective

This perspective views the “information content” of data as its “spread” or **variance**. If a dataset has a lot of variance along a certain direction, it suggests that there’s significant information or variability in that direction. The core idea here is to find a set of orthogonal directions (the principal components) such that when the data is projected onto these directions, the variance of the projected data is maximized. This ensures that as much information as possible is retained in the lower-dimensional representation.

To find the first principal component, we seek a unit vector b₁ in R^D (that is, the magnitude of b₁ equals 1) such that the variance of the projected data onto this direction, Var[b₁ transposed times x], is maximized. Through a bit of mathematical elegance, this problem can be reformulated as finding the eigenvector of the data covariance matrix S that corresponds to its largest eigenvalue. This eigenvector, b₁, points in the direction where the data is most spread out.

For the subsequent principal components, b₂ through b_M, we continue this process. Each successive component is chosen to be orthogonal to all previously found components while maximizing the remaining variance. This process ultimately yields the eigenvectors of S corresponding to the M largest eigenvalues. These eigenvectors are the principal components, and their corresponding eigenvalues quantify the amount of variance captured along each component. The total variance captured by the M principal components is simply the sum of their associated eigenvalues: V_M equals the sum from m = 1 to M of lambda_m.

This perspective highlights how PCA naturally accounts for the correlations between dimensions and their individual variances. Interestingly, if the dimensions in your original data are not correlated, PCA offers no significant gain, as the principal components would simply align with the original axes.

2. Projection (Minimum Reconstruction Error) Perspective

This second viewpoint is often more intuitive for many. It frames PCA as a problem of finding a lower-dimensional subspace such that the average squared reconstruction error between the original data points and their projections onto this subspace is minimized. In essence, we want the projected (reconstructed) data to be as “close” as possible to the original data.

Mathematically, this means minimizing the objective function: J_M equals one divided by N times the sum from n = 1 to N of the squared magnitude of (x_n minus x-tilde_n). Here, x-tilde_n is the reconstruction of x_n from its lower-dimensional representation z_n, as we discussed earlier (x-tilde_n equals B times z_n). If B forms an orthonormal basis, then z_n equals B transposed times x_n, and the reconstruction is x-tilde_n equals B times B transposed times x_n. The matrix P equals B times B transposed equals the sum from m = 1 to M of (b_m times b_m transposed) is the projection matrix onto the principal subspace.

Remarkably, minimizing this reconstruction error leads to the exact same solution as the maximum variance approach: the columns of B are precisely the eigenvectors of the data covariance matrix S corresponding to its M largest eigenvalues. This connection is formally established by theorems like the Eckart–Young theorem. This means that PCA effectively finds the best rank-M approximation of the original data. The reconstruction error itself is directly related to the sum of the discarded (smaller) eigenvalues.

### **The Practical Steps of PCA**

In practice, applying PCA involves a straightforward sequence of steps:

1. Mean Subtraction (Centering): First, calculate the mean mu of your dataset. Then, subtract this mean from every data point x_n to ensure the dataset is centered around the origin. That is, replace x_n with (x_n minus mu). This centering is crucial for the covariance matrix to correctly represent the spread of the data relative to its mean.
2. Compute the Covariance Matrix: Calculate the sample covariance matrix S from your centered data using the formula S equals one divided by N times the sum from n = 1 to N of (x_n times x_n transposed).
3. Perform Eigenvalue Decomposition: Find the eigenvalues and corresponding eigenvectors of the covariance matrix S.
4. Select Principal Components: Sort the eigenvalues in descending order. Then, select the top M eigenvectors corresponding to the largest eigenvalues. These chosen eigenvectors become the columns of your transformation matrix B (or W, depending on notation). The choice of M can be guided by a “scree graph,” which plots the eigenvalues in descending order, looking for an “elbow” where adding more components doesn’t significantly increase the explained variance.
5. Project the Data: Transform your original (now centered) data x_n into the new lower-dimensional space using the selected principal components: z_n equals B transposed times x_n. These z_n vectors are your new, compressed data points.
6. Reconstruction (Optional): If you wish to see how much information was retained, you can reconstruct the data back into the original dimensionality using x-tilde_n equals B times z_n equals B times B transposed times x_n. PCA guarantees that this reconstruction error is minimized among all linear projections.

### **Key Insights and Properties of PCA**

- **Unsupervised Nature:** As mentioned, PCA operates without any knowledge of class labels or target outputs, focusing solely on the input data structure.
- **Linearity:** PCA finds a linear transformation of the data. This means it can only capture linear relationships and cannot find complex non-linear structures.
- **Correlation Sensitivity:** PCA thrives when there are strong correlations between the original features, as these redundancies are what it exploits for compression.
- **Reconstruction Quality:** The quality of reconstruction depends directly on the number of principal components retained. Discarded components contribute to the reconstruction error.
- **High-Dimensional Scenarios (D greater than N):** In situations where the number of dimensions D is much larger than the number of data points N, directly computing the D-by-D covariance matrix can be prohibitive. Fortunately, one can instead work with the smaller N-by-N matrix X transposed times X (or X times X transposed) to find the eigenvectors, because the rank of the covariance matrix cannot exceed the smaller of D or N. This makes PCA feasible even in extremely high-dimensional settings.
- **Outlier Sensitivity:** PCA is sensitive to outliers because the calculation of the covariance matrix, which forms the basis for eigenvectors, is heavily influenced by points far from the mean.
- **Contrast with Linear Discriminant Analysis (LDA):** While both are linear dimensionality reduction techniques, PCA is unsupervised. LDA, on the other hand, is a supervised method that uses class labels to find directions that best separate different classes.
- **Connection to Autoencoders**: PCA can be seen as a special case of a linear autoencoder. A single-hidden-layer autoencoder with linear activation functions and a squared error loss function will effectively perform PCA.

### **Probabilistic PCA (PPCA): A Deeper Dive**

The generative process for PPCA is as follows:

1. First, a continuous latent variable z_n in R^M is sampled from a standard normal prior distribution: z_n follows a normal distribution with mean 0 and identity covariance matrix.
2. Then, the observed data point x_n in R^D is generated from a linear (affine) transformation of z_n, plus some Gaussian observation noise: x_n given z_n follows a normal distribution with mean (B times z_n plus mu) and covariance sigma squared times the identity matrix. Here, B is a D-by-M matrix representing the linear mapping from the latent space to the observed space, mu is the mean of the observed data, and sigma squared is the scalar variance of the isotropic Gaussian observation noise.
3. The beauty of PPCA is that, in the noise-free limit (where sigma approaches 0), its maximum likelihood solution exactly matches the solution obtained by traditional PCA. The leftover variance not captured by the principal components is attributed to noise.