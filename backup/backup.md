## create data volume
```
> docker volume create --name autocv_data
```

## backup from data volume
```
> docker run --rm -v autocv_data:/root/.sqlite -v (pwd):/backup bash cp /backup/autocv-backup.db /root/.sqlite/autocv.db
```

## restore from backup to data volume
```
> docker run --rm -v autocv_data:/root/.sqlite -v (pwd):/backup bash cp /root/.sqlite/autocv.db /backup/autocv-backup.db
```
