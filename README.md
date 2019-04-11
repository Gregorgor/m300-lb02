# Dokumentation Modul 300 LB02

## Inhaltsverzeichnis

-   01 - Einstieg
-   02 - Docker / Kubernetes Umsetzung
-   03 - Sicherheitsaspekte
-   04 - Abschluss

---

## 01 Einstieg

### Persönlicher Wissensstand

| Technologie        | Beschreibung                                                                                                                                                                                                                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Docker / Container | Ich konnte bereits Erfahrungen mit Docker sammeln. Bei der Arbeit habe ich eine PHP-Applikation in einem Docker-Container entwickelt und dann auch so deployed. Zudem konnte ich bereits einige Erfahrungen mit KVM-Containern sammeln.                                                                                              |
| Microservices      | Microservies kenne ich lediglich aus der Theorie. Ich weiss, dass damit kleine, kompakte Applikationen in einem Container gemeint sind. Zudem kann man dann tools wie Kubernetes verwenden, um viele dieser kleinen Container zu managen. Allerdings konnte ich bisher noch keine Praxiserfahrungen mit diesen Technologien sammeln. |

### Kennt die Docker-Befehle

| Befehl       | Beschreibung                                       |
| ------------ | -------------------------------------------------- |
| docker run   | Führt ein Befehl in einem neuen Container aus      |
| docker start | Startet einen oder mehrere gestoppte Container     |
| docker stop  | Stoppt einen oder mehrere laufende ontainer        |
| docker build | Erstellt ein Image aus einem Docker-File           |
| docker pull  | Ladet ein Image aus der Registry                   |
| docker push  | Ladet ein Image in die Registry hoch               |
| docker exec  | Führ einen Befehl in einem laufenden Container aus |

### Docker Volumes

Falls ein Verzeichnis innerhalb des Containers persistent gespeichert werden soll, muss dies speziell gekennzeichnet werden. Dies kann zum Beispiel wichtig sein, wenn man eine MySQL-Datenbank innerhalb eines Containers einsetzt.

## 02 Docker Umsetzung

### Projektbezeichnung

Es wurde ein Projekt bestehend aus drei Containern erstellt. Zum einen gibt es ein Web-Frontend in einem NGINX Container und das dazugehörige Backend mit Python Flask. Zudem gibt es dann noch einen MySQL Container für die persistente Datenspeicherung in einer Datenbank. Das ganze wurde in der Google Cloud in einem Kubernetes Cluster realisiert.

### Netzwerkplan

    +---------------------------------------------------------------+
    ! Container: Nginx Frontend Webserver - 34.65.185.255:80        !
    ! Container: Python Flask Backend API - 34.65.90.233:8080       !
    ! Container: MySQL Datenbank - Hostname: mysql - no public IP   !
    +---------------------------------------------------------------+
    ! Container-Engine: Docker                                      !
    +---------------------------------------------------------------+
    ! Kubernetes Umgebung Google Cloud (GKE) - 3 Node Cluster       !
    +---------------------------------------------------------------+
    ! Notebook macOS - Schulnetz 10.x.x.x                           !
    +---------------------------------------------------------------+

### Volumes

Für die Datenbank wurde ein persistentes Volumen eingerichtet. Dieses wird ebenfalls in der Google Cloud als "Storage" gehostet und hat eine Grösse von 2GB.

### Image-Bereitstellung

Die selbst für dieses Projekt erstellten Docker-Images werden in dem Docker Hub unter dem Benutzer `fnoah` gehostet. Kubernetes bezieht diese dann automatisch von dort.

### Relevante Befehle

-   docker build -t fnoah/m300-lb02-web .
-   docker push fnoah/m300-lb02-web

-   delete pod to update image

-   kubectl expose deployment hello-minikube --type=NodePort

-   kubectl exec -it web-deployment -- /bin/bash

-   kubectl get services

## 03 Sicherheitsaspekte

### Logging

In der Kubernetes-Umgebung können logs mit folgendem Befehl abgerufen werden: `kubectl logs <pod-name>`

### Überwachung

Für lokale Container kann mit folgendem Befehl ein Monitoring-Container eingesetztwerden: `docker run -d --name cadvisor -v /:/rootfs:ro -v /var/run:/var/run:rw -v /sys:/sys:ro -v /var/lib/docker/:/var/lib/docker:ro -p 8080:8080 google/cadvisor:latest`

In der Kubernetes-Umgebung mit Google Cloud gibt es eine Web-Console, wo all diese Monitoring-Funktionalitäten bereits eingebaut sind.

### Sicherheitsaspekte

-   Lediglich der Port 80 des Web-Frontends und der Port 8080 der API wurdem via `LoadBalancer` nach Aussen freigegeben
-   Container laufen in einer dedizierten virtuellen Maschine in der Google Cloud
-   Die verwendeten Images definieren einen Benutzer und laufen nicht direkt als root
-   In Kubernetes wurden die Container in einzelne Deployments aufgeteilt

## 04 Abschluss

### Testfälle

| Testfall                                                                                                                               | Resultat                                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Vom Client (192.168.40.1) auf http://34.65.185.255/ zugreifen                                                                          | Funktioniert. Die Homepage des Webservers wird angezeigt                                                               |
| Vom Client (192.168.40.1) auf http://34.65.90.233:8080/ zugreifen                                                                      | Funktioniert. Die JSON Response der API wird angezeigt (wird normalerweise lediglich über JavaScript aufgerufen)       |
| Vom Client (192.168.40.1) auf die Datenbank (mysql) zugreifen                                                                          | Man erhält keine Antwort, da die Datenbank lediglich intern freigegeben wurde und keine öffentliche IP-Adresse besitzt |
| Von dem API-Server (34.65.90.233) auf die Datenbank (Hostname: mysql) zugreifen mit dem Benutzer `root` und dem dazugehörigen Passwort | Funktioniert. Der MySQL Port 3306 wurde intern in freigegeben                                                          |

### Vergleich Vorwissen / Wissenszuwachs

Hauptsächlich konnte ich während dieses Projektes Fähigkeiten verbessern. Die Vagrant-Grundlagen habe ich bereits gekannt, konnte hier aber erstmals mit einem Multi-VM-System arbeiten. Allerdings habe ich zuvor noch nie Shell-Scripts für die automatisierte Installation von Diensten erstellt, was sehr lehrreich war.

Ich könnte während diesem Projekt sehr viel neues über Docker und insbesondere Kubernetes mit Google Cloud lernen, da ich zuvor erst mit Docker an sich gearbeitet habe. Deshalb habe ich mir in sehr vielen Gebieten neues Wissen zu Kubernetes aneignen können und auch ein paar neue Dinge bezüglich Docker gelernt.

### Reflextion

Dieses Projekt lief meiner Meinung nach sehr gut. Ich kam schnell voran und konnte bis zum Ende des Projektes mein Projekt gut abschliessen, sodass ich mit dem Endresultat zufrieden war. Während der Realisierung hatte ich zwischenzeitlich Schwierigkeiten mit dem Kubernetes Networking, die ich dann aber alle lösen konnte.
