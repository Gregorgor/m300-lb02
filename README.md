# Dokumentation Modul 300 LB01

Make new branch from commit faa5e08e4491246865fb9aa85955ea7abcc5b7a0 (where the db still works and then first add reverse proxy and then firewall and finally some small mysql changes)

## Inhaltsverzeichnis

-   01 - Einstieg
-   02 - Docker Umsetzung
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

### Netzwerkplan

    +---------------------------------------------------------------+
    ! Container: Nginx Frontend Webserver                           !
    ! Container: Python Flask Backend API                           !
    +---------------------------------------------------------------+
    ! Container-Engine: Docker                                      !
    +---------------------------------------------------------------+
    ! Minikube Kubernetes Umgebung                                  !
    +---------------------------------------------------------------+
    ! Hypervisor: VirtualBox                                        !
    +---------------------------------------------------------------+
    ! Host-OS: macOS                                                !
    +---------------------------------------------------------------+
    ! Notebook - Schulnetz 10.x.x.x                                 !
    +---------------------------------------------------------------+

### Relevante Befehle

-   kubectl expose deployment web-deployment --type=NodePort
-   minikube service web-deployment --url

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

In der Kubernetes-Umgebung mit Minicube kann man mit folgendem Befehl das Webinterface aufrufen, wo diese Funktionalitäten bereits integriert sind.

### Sicherheitsaspekte

-   Lediglich der Port 80 des Web-Frontends wurde via `NodePort` nach Aussen freigegeben
-   Container laufen in einer dedizierten virtuellen Maschine auf meinem Host
-   Die verwendeten Images definieren einen Benutzer und laufen nicht direkt als root
-   In Kubernetes wurden die Container in einzelne Deployments aufgeteilt

## 04 Abschluss

### Testfälle

| Testfall                                                                                              | Resultat                                                                                                                                |
| ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Vom Client (192.168.40.1) auf http://<kubernetes-ip>:80 zugreifen                                     | Funktioniert. Die Default Page des Proxy Servers (192.168.40.99) wird angezeigt                                                         |
| Vom Client (192.168.40.1) auf http://localhost:5000/proxy                                             | Funktioniert. Die PHP-Seite mti den Datenbank-Daten des Webservers (192.168.40.100) wird angezeigt                                      |
| Vom Client (192.168.40.1) auf http://192.168.40.100 zugreifen                                         | Man erhält keine Antwort, da die Firewall nur Verbindungen vom dem Proxy zulässt                                                        |
| Vom Client (192.168.40.1) auf die Datenbank (192.168.40.101) zugreifen mit dem Benutzeraccount `root` | Funktioniert nicht, da die Firewall den Zugriff blockiert und der Benutzer in SQL zusätzlich auch nur für 192.168.40.100 zugelassen ist |
| Vom Client (192.168.40.1) auf die Datenbank (192.168.40.101) zugreifen mit dem Benutzeraccount `root` | Funktioniert nicht, da die Firewall den Zugriff blockiert und der Benutzer in SQL zusätzlich auch nur für 192.168.40.100 zugelassen ist |
| Vom Client (192.168.40.1) auf den Webserver (192.168.40.100) zugreifen per SSH                        | Funktioniert, da eine SSH Verbindung vom Client her zugelassen wurde in der Firewall                                                    |
| Vom Proxy (192.168.40.99) auf den Webserver (192.168.40.100) zugreifen per SSH                        | Funktioniert nicht, da diese SSH Verbindung in der Firewall nicht zugelassen wurde                                                      |

### Vergleich Vorwissen / Wissenszuwachs

Hauptsächlich konnte ich während dieses Projektes Fähigkeiten verbessern. Die Vagrant-Grundlagen habe ich bereits gekannt, konnte hier aber erstmals mit einem Multi-VM-System arbeiten. Allerdings habe ich zuvor noch nie Shell-Scripts für die automatisierte Installation von Diensten erstellt, was sehr lehrreich war.

Ich könnte während diesem Projekt sehr viel neues über Docker und insbesondere Kubernetes lernen, da ich zuvor erst mit Docker an sich gearbeitet habe. Deshalb habe ich mir in sehr vielen Gebieten neues Wissen zu Kubernetes aneignen können und auch ein paar neue Dinge bezüglich Docker gelernt.

### Reflextion

Dieses Projekt lief meiner Meinung nach sehr gut. Ich kam schnell voran und konnte bis zum Ende des Projektes mein Projekt gut abschliessen, sodass ich mit dem Endresultat zufrieden war. Während der Realisierung hatte ich zwischenzeitlich Schwierigkeiten mit dem Kubernetes Networking, die ich dann aber alle lösen konnte.
