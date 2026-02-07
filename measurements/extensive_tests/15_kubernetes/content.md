# Extracted Content from kubernetes.io

**Source:** https://kubernetes.io/docs/home/
**Crawled:** 2026-02-02T05:59:15.837Z
**Pages:** 5 extracted, 5 skipped
**Tokens:** ~4 499 estimated
**Duration:** 8s

---

## Table of Contents

1. [Kubernetes Documentation](#kubernetes-documentation)
2. [Production-Grade Container Orchestration](#production-grade-container-orchestration)
3. [Kubernetes Documentation](#kubernetes-documentation)
4. [Training](#training)
5. [Kubernetes Blog](#kubernetes-blog)

---

## Kubernetes Documentation

> Source: https://kubernetes.io/docs/home
> Tokens: ~1 194

Kubernetes is an open source container orchestration engine for automating deployment, scaling, and management of containerized applications. The open source project is hosted by the Cloud Native Computing Foundation ([CNCF](https://www.cncf.io/about)).



## Understand Kubernetes

Learn about Kubernetes and its fundamental concepts.

- [Why Kubernetes?](https://kubernetes.io/docs/concepts/overview/#why-you-need-kubernetes-and-what-can-it-do)
- [Components of a cluster](https://kubernetes.io/docs/concepts/overview/components/)
- [The Kubernetes API](https://kubernetes.io/docs/concepts/overview/kubernetes-api/)
- [Objects In Kubernetes](https://kubernetes.io/docs/concepts/overview/working-with-objects/)
- [Containers](https://kubernetes.io/docs/concepts/containers/)
- [Workloads and Pods](https://kubernetes.io/docs/concepts/workloads/)

## Try Kubernetes

Follow tutorials to learn how to deploy applications in Kubernetes.

- [Hello Minikube](https://kubernetes.io/docs/tutorials/hello-minikube/)
- [Walkthrough the basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
- [Stateless Example: PHP Guestbook with Redis](https://kubernetes.io/docs/tutorials/stateless-application/guestbook/)
- [Stateful Example: Wordpress with Persistent Volumes](https://kubernetes.io/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/)

## Set up a K8s cluster

Get Kubernetes running based on your resources and needs.

- [Learning environment](https://kubernetes.io/docs/setup/#learning-environment)
- [Production environment](https://kubernetes.io/docs/setup/#production-environment)
- [Install the kubeadm setup tool](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)
- [Metrics](https://kubernetes.io/docs/concepts/cluster-administration/observability/#metrics)
- [Logs](https://kubernetes.io/docs/concepts/cluster-administration/observability/#logs)
- [Traces](https://kubernetes.io/docs/concepts/cluster-administration/observability/#traces)
- [Securing a cluster](https://kubernetes.io/docs/concepts/cluster-administration/#securing-a-cluster)
- [kubeadm command reference](https://kubernetes.io/docs/reference/setup-tools/kubeadm/)

## Learn how to use Kubernetes

Look up common tasks and how to perform them using a short sequence of steps.

- [kubectl Quick Reference](https://kubernetes.io/docs/reference/kubectl/quick-reference/)
- [Install kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)
- [Configure access to clusters](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
- [Use the Web UI Dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/)
- [Configure a Pod to Use a ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/)
- [Getting help](https://kubernetes.io/docs/tasks/debug/)

## Look up reference information

Browse terminology, command line syntax, API resource types, and setup tool documentation.

- [Glossary](https://kubernetes.io/docs/reference/glossary/)
- [kubectl command line tool](https://kubernetes.io/docs/reference/kubectl/)
- [Labels, annotations and taints](https://kubernetes.io/docs/reference/labels-annotations-taints/#labels-annotations-and-taints-used-on-api-objects)
- [Kubernetes API reference](https://kubernetes.io/docs/reference/kubernetes-api/)
- [Overview of API](https://kubernetes.io/docs/reference/using-api/)
- [Feature Gates](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/)

## Contribute to Kubernetes

Find out how you can help make Kubernetes better.

- [Contribute to Kubernetes](https://kubernetes.io/docs/contribute/)
- [Contribute to documentation](https://kubernetes.io/docs/contribute/docs/)
- [Suggest content improvements](https://kubernetes.io/docs/contribute/suggesting-improvements/#opening-an-issue)
- [Opening a pull request](https://kubernetes.io/docs/contribute/new-content/open-a-pr/)
- [Documenting a feature for a release](https://kubernetes.io/docs/contribute/new-content/new-features/)
- [Localizing the docs](https://kubernetes.io/docs/contribute/localization/)
- [Participating in SIG Docs](https://kubernetes.io/docs/contribute/participate/)
- [Viewing Site Analytics](https://kubernetes.io/docs/contribute/analytics/)

## Training

Get certified in Kubernetes and make your cloud native projects successful!

## Download Kubernetes

Install Kubernetes or upgrade to the newest version.

## About the documentation

This website contains documentation for the current and previous 4 versions of Kubernetes.

Last modified August 07, 2025 at 9:34 PM PST: [Prepare docs home page for Docsy (710d15e99b)](https://github.com/kubernetes/website/commit/710d15e99b77f6b837d12439e4b3110c27332c7a)

---

## Production-Grade Container Orchestration

> Source: https://kubernetes.io/
> Tokens: ~1 260

[Kubernetes](https://kubernetes.io/docs/concepts/overview/), also known as K8s, is an open source system for automating deployment, scaling, and management of containerized applications.

It groups containers that make up an application into logical units for easy management and discovery. Kubernetes builds upon [15 years of experience of running production workloads at Google](https://queue.acm.org/detail.cfm?id=2898444), combined with best-of-breed ideas and practices from the community.

#### Planet scale

Designed on the same principles that allow Google to run billions of containers a week, Kubernetes can scale without increasing your operations team.

#### Never outgrow

Whether testing locally or running a global enterprise, Kubernetes flexibility grows with you to deliver your applications consistently and easily no matter how complex your need is.

#### Run K8s anywhere

Kubernetes is open source giving you the freedom to take advantage of on-premises, hybrid, or public cloud infrastructure, letting you effortlessly move workloads to where it matters to you.

To download Kubernetes, visit the [download](https://kubernetes.io/releases/download/) section.

## The Absolute Beginner's Guide To Cloud Native

## Attend upcoming KubeCon + CloudNativeCon events

## Kubernetes Features

### [Automated rollouts and rollbacks](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

Kubernetes progressively rolls out changes to your application or its configuration, while monitoring application health to ensure it doesn't kill all your instances at the same time. If something goes wrong, Kubernetes will rollback the change for you. Take advantage of a growing ecosystem of deployment solutions.

### [Service discovery and load balancing](https://kubernetes.io/docs/concepts/services-networking/service/)

No need to modify your application to use an unfamiliar service discovery mechanism. Kubernetes gives Pods their own IP addresses and a single DNS name for a set of Pods, and can load-balance across them.

### [Storage orchestration](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)

Automatically mount the storage system of your choice, whether from local storage, a public cloud provider, or a network storage system such as iSCSI or NFS.

### [Secret and configuration management](https://kubernetes.io/docs/concepts/configuration/secret/)

Deploy and update Secrets and application configuration without rebuilding your image and without exposing Secrets in your stack configuration.

### [Automatic bin packing](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)

Automatically places containers based on their resource requirements and other constraints, while not sacrificing availability. Mix critical and best-effort workloads in order to drive up utilization and save even more resources.

### [Batch execution](https://kubernetes.io/docs/concepts/workloads/controllers/job/)

In addition to services, Kubernetes can manage your batch and CI workloads, replacing containers that fail, if desired.

### [Self-healing](https://kubernetes.io/docs/concepts/architecture/self-healing/#automated-recovery-from-damage)

Kubernetes restarts containers that crash, replaces entire Pods where needed, reattaches storage in response to wider failures, and can integrate with node autoscalers to self-heal even at the node level.

### [Horizontal scaling](https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/)

Scale your application up and down with a simple command, with a UI, or automatically based on CPU usage.

### [Vertical scaling](https://kubernetes.io/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/)

Automatically adjust resource requests and limits based on actual usage patterns.

### [Case Studies](https://kubernetes.io/case-studies/)

![Babylon Case Study](https://kubernetes.io/case-studies/babylon/babylon_featured_logo.svg)

"Kubernetes is a great platform for machine learning because it comes with all the scheduling and …"

[Read more](https://kubernetes.io/case-studies/babylon/)

![Booz Allen Case Study](https://kubernetes.io/case-studies/booz-allen/booz-allen_featured_logo.svg)

"Kubernetes is a great solution for us. It allows us to rapidly iterate on our clients' demands. "

[Read more](https://kubernetes.io/case-studies/booz-allen/)

![Booking.com Case Study](https://kubernetes.io/case-studies/booking-com/booking.com_featured_logo.svg)

"We realized that we needed to learn Kubernetes better in order to fully use the potential of it. At …"

[Read more](https://kubernetes.io/case-studies/booking-com/)

![AppDirect Case Study](https://kubernetes.io/case-studies/appdirect/appdirect_featured_logo.svg)

"We made the right decisions at the right time. Kubernetes and the cloud native technologies are now …"

[Read more](https://kubernetes.io/case-studies/appdirect/)

We are a [CNCF](https://cncf.io/) graduated project

![Cloud Native Computing Foundation logo](https://kubernetes.io/images/cncf-logo-white.svg)

---

## Kubernetes Documentation

> Source: https://kubernetes.io/docs
> Tokens: ~100

© 2026 The Kubernetes Authors | Documentation Distributed under [CC BY 4.0](https://git.k8s.io/website/LICENSE)

© 2026 The Linux Foundation ®. All rights reserved. The Linux Foundation has registered trademarks and uses trademarks. For a list of trademarks of The Linux Foundation, please see our [Trademark Usage page](https://www.linuxfoundation.org/trademark-usage)

ICP license: 京ICP备17074266号-3

---

## Training

> Source: https://kubernetes.io/training
> Tokens: ~1 244

## Build your cloud native career

Kubernetes is at the core of the cloud native movement. Training and certifications from the Linux Foundation and our training partners lets you invest in your career, learn Kubernetes, and make your cloud native projects successful.

## Take a free course on edX

##### **Introduction to Kubernetes** 

Want to learn Kubernetes? Get an in-depth primer on this powerful system for managing containerized applications.


[Go to Course](https://www.edx.org/course/introduction-to-kubernetes)

##### **Introduction to Cloud Infrastructure Technologies**

Learn the fundamentals of building and managing cloud technologies directly from The Linux Foundation, the leader in open source.


[Go to Course](https://www.edx.org/course/introduction-to-cloud-infrastructure-technologies)

##### **Introduction to Linux**

Never learned Linux? Want a refresh? Develop a good working knowledge of Linux using both the graphical interface and command line across the major Linux distribution families.


[Go to Course](https://www.edx.org/course/introduction-to-linux)

## Learn with the Linux Foundation

The Linux Foundation offers instructor-led and self-paced courses for all aspects of the Kubernetes application development and operations lifecycle.

[See Courses](https://training.linuxfoundation.org/training/course-catalog/?_sft_technology=kubernetes)

## Get Kubernetes Certified

##### **Kubernetes and Cloud Native Associate (KCNA)**

The Kubernetes and Cloud Native Associate (KCNA) exam demonstrates a user’s foundational knowledge and skills in Kubernetes and the wider cloud native ecosystem.

A certified KCNA will confirm conceptual knowledge of the entire cloud native ecosystem, particularly focusing on Kubernetes.

[Go to Certification](https://training.linuxfoundation.org/certification/kubernetes-cloud-native-associate/)

##### **Kubernetes and Cloud Native Security Associate (KCSA)**

The KCSA is a pre-professional certification designed for candidates interested in advancing to the professional level through a demonstrated understanding of foundational knowledge and skills of security technologies in the cloud native ecosystem.

A certified KCSA will confirm an understanding of the baseline security configuration of Kubernetes clusters to meet compliance objectives.

[Go to Certification](https://training.linuxfoundation.org/certification/kubernetes-and-cloud-native-security-associate-kcsa/)

##### **Certified Kubernetes Application Developer (CKAD)**

The Certified Kubernetes Application Developer exam certifies that users can design, build, configure, and expose cloud native applications for Kubernetes.

A CKAD can define application resources and use core primitives to build, monitor, and troubleshoot scalable applications and tools in Kubernetes.

[Go to Certification](https://training.linuxfoundation.org/certification/certified-kubernetes-application-developer-ckad/)

##### **Certified Kubernetes Administrator (CKA)**

The Certified Kubernetes Administrator (CKA) program provides assurance that CKAs have the skills, knowledge, and competency to perform the responsibilities of Kubernetes administrators.

A certified Kubernetes administrator has demonstrated the ability to do basic installation as well as configuring and managing production-grade Kubernetes clusters.

[Go to Certification](https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/)

##### **Certified Kubernetes Security Specialist (CKS)**

The Certified Kubernetes Security Specialist program provides assurance that the holder is comfortable and competent with a broad range of best practices. CKS certification covers skills for securing container-based applications and Kubernetes platforms during build, deployment and runtime.

*Candidates for CKS must hold a current Certified Kubernetes Administrator (CKA) certification to demonstrate they possess sufficient Kubernetes expertise before sitting for the CKS.*

[Go to Certification](https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/)

## Kubestronaut Program: Elevate Your Kubernetes Expertise

The CNCF's Kubestronaut Program celebrates and recognizes exceptional community leaders who have demonstrated a profound commitment to mastering Kubernetes. This prestigious initiative highlights individuals who have consistently invested in their ongoing education and achieved the highest levels of proficiency. To earn the esteemed title of Kubestronaut, individuals must successfully obtain and maintain all five CNCF Kubernetes certifications: Certified Kubernetes Administrator (CKA), Certified Kubernetes Application Developer (CKAD), Certified Kubernetes Security Specialist (CKS), Kubernetes and Cloud Native Associate (KCNA), and Kubernetes and Cloud Native Security Associate (KCSA).

## Kubernetes Training Partners

Our network of Kubernetes Training Partners provide training services for Kubernetes and cloud native projects.

---

## Kubernetes Blog

> Source: https://kubernetes.io/blog
> Tokens: ~701

## Posts in 2026

- ##### [Experimenting with Gateway API using kind](https://kubernetes.io/blog/2026/01/28/experimenting-gateway-api-with-kind/)

By **[Ricardo Katz](https://github.com/rikatz) (Red Hat)** | Wednesday, January 28, 2026 in Blog

This document will guide you through setting up a local experimental environment with Gateway API on kind. This setup is designed for learning and testing. It helps you understand Gateway API concepts without production complexity. Caution:This is an …

[Read more](https://kubernetes.io/blog/2026/01/28/experimenting-gateway-api-with-kind/)- ##### [Cluster API v1.12: Introducing In-place Updates and Chained Upgrades](https://kubernetes.io/blog/2026/01/27/cluster-api-v1-12-release/)

By **Fabrizio Pandini (Broadcom)** | Tuesday, January 27, 2026 in Blog

Cluster API brings declarative management to Kubernetes cluster lifecycle, allowing users and platform teams to define the desired state of clusters and rely on controllers to continuously reconcile toward it. Similar to how you can use StatefulSets …

[Read more](https://kubernetes.io/blog/2026/01/27/cluster-api-v1-12-release/)- ##### [Headlamp in 2025: Project Highlights](https://kubernetes.io/blog/2026/01/22/headlamp-in-2025-project-highlights/)

By **Evangelos Skopelitis (Microsoft)** | Thursday, January 22, 2026 in Blog

This announcement is a recap from a post originally published on the Headlamp blog. Headlamp has come a long way in 2025. The project has continued to grow – reaching more teams across platforms, powering new workflows and integrations through …

[Read more](https://kubernetes.io/blog/2026/01/22/headlamp-in-2025-project-highlights/)

- ##### [Uniform API server access using clientcmd](https://kubernetes.io/blog/2026/01/19/clientcmd-apiserver-access/)

By **[Stephen Kitt](https://github.com/skitt) (Red Hat)** | Monday, January 19, 2026 in Blog

If you've ever wanted to develop a command line client for a Kubernetes API, especially if you've considered making your client usable as a kubectl plugin, you might have wondered how to make your client feel familiar to users of kubectl. A quick …

[Read more](https://kubernetes.io/blog/2026/01/19/clientcmd-apiserver-access/)

- ##### [Kubernetes v1.35: Mutable PersistentVolume Node Affinity (alpha)](https://kubernetes.io/blog/2026/01/08/kubernetes-v1-35-mutable-pv-nodeaffinity/)

By **Weiwen Hu (Alibaba Cloud), YuanHui Qiu (Alibaba Cloud)** | Thursday, January 08, 2026 in Blog

The PersistentVolume node affinity API dates back to Kubernetes v1.10. It is widely used to express that volumes may not be equally accessible by all nodes in the cluster. This field was previously immutable, and it is now mutable in Kubernetes v1.35 …

[Read more](https://kubernetes.io/blog/2026/01/08/kubernetes-v1-35-mutable-pv-nodeaffinity/)